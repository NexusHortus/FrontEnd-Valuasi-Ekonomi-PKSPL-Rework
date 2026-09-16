import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, ChevronRight, Navigation2, RefreshCw } from 'lucide-react';
import { categories, locations, getCategoryInfo, PROVINCE_GEOJSON_URL } from './map/mapData';

// Fix default marker icon issues in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to create colored SVG marker icon
const createSvgIcon = (color) => L.divIcon({
  html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Helper component to bind the map instance to a ref
function MapController({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

export default function MapSection() {
  const [activeFilters, setActiveFilters] = useState(categories.map(c => c.id));
  const [selectedLocId, setSelectedLocId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geojsonData, setGeojsonData] = useState(null);
  const mapRef = useRef(null);

  // Fetch GeoJSON for province polygons
  useEffect(() => {
    fetch(PROVINCE_GEOJSON_URL)
      .then(res => res.json())
      .then(data => setGeojsonData(data))
      .catch(err => console.error("Error loading geojson", err));
  }, []);

  // Filter toggle handler
  const toggleFilter = (categoryId) => {
    setActiveFilters(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter locations based on active categories and search query
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
      activeFilters.includes(loc.category) &&
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeFilters, searchQuery]);

  // Calculate statistics per category
  const stats = useMemo(() => {
    const counts = {};
    categories.forEach(c => counts[c.id] = 0);
    locations.forEach(loc => {
      if (counts[loc.category] !== undefined) {
        counts[loc.category]++;
      }
    });
    return counts;
  }, []);

  // Color palette for province polygons
  const provinceColors = [
    '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
    '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#10b981',
    '#f43f5e', '#0891b2', '#d946ef', '#eab308', '#2563eb',
    '#16a34a', '#dc2626', '#7c3aed', '#0d9488', '#ea580c',
    '#c026d3', '#65a30d', '#be123c', '#0284c7', '#9333ea',
    '#059669', '#e11d48', '#4f46e5', '#0f766e', '#c2410c',
    '#a21caf', '#4d7c0f', '#9f1239',
  ];

  const getProvinceColor = (index) => provinceColors[index % provinceColors.length];

  // Handle GeoJSON feature interactions (hover, tooltip)
  const onEachFeature = useCallback((feature, layer) => {
    const name = feature.properties.state || feature.properties.Propinsi || feature.properties.name || feature.properties.NAME || '';
    if (name) {
      layer.bindTooltip(name, {
        sticky: true,
        direction: 'center',
        className: 'province-tooltip',
      });
    }

    const featureIndex = feature.properties.id_1 || feature.properties.cartodb_id || 0;
    const baseColor = getProvinceColor(featureIndex);

    layer.setStyle({
      fillColor: baseColor,
      fillOpacity: 0.25,
      weight: 1.5,
      color: '#ffffff',
      opacity: 0.8,
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.45,
          weight: 2.5,
          color: '#1e293b',
        });
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.25,
          weight: 1.5,
          color: '#ffffff',
        });
      }
    });
  }, []);

  const geojsonStyle = {
    fillColor: '#3b82f6',
    fillOpacity: 0.25,
    weight: 1.5,
    color: '#ffffff',
    opacity: 0.8,
  };

  // Pan map and select location when clicked from sidebar
  const handleLocationClick = (loc) => {
    setSelectedLocId(loc.id);
    if (mapRef.current) {
      mapRef.current.flyTo(loc.coords, 10, { duration: 1.5 });
    }
  };

  return (
    <section className="py-20 bg-white" id="map-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sebaran Wilayah Valuasi &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Pemetaan Jasa Ekosistem</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Eksplorasi lokasi valuasi ekonomi sumber daya pesisir dan laut di seluruh Indonesia melalui peta interaktif.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(cat => {
            const isActive = activeFilters.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleFilter(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-slate-800 shadow-md border border-slate-200' 
                    : 'bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200 hover:text-slate-600'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: isActive ? cat.color : '#cbd5e1' }}
                />
              </button>
            );
          })}
        </div>

        {/* Map & Sidebar */}
        <div className="flex flex-col lg:flex-row h-[600px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
          
          {/* Map Area */}
          <div className="flex-1 relative z-0">
            <MapContainer
              center={[-2.5, 118.0]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <MapController mapRef={mapRef} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {geojsonData && (
                <GeoJSON 
                  key={geojsonData.type || 'geojson'} 
                  data={geojsonData} 
                  style={geojsonStyle}
                  onEachFeature={onEachFeature}
                />
              )}

              {filteredLocations.map(loc => {
                const catInfo = getCategoryInfo(loc.category);
                return (
                  <Marker 
                    key={loc.id} 
                    position={loc.coords}
                    icon={createSvgIcon(catInfo.color)}
                    eventHandlers={{
                      click: () => setSelectedLocId(loc.id)
                    }}
                  >
                    <Popup className="custom-popup" minWidth={320}>
                      <div className="p-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span 
                            className="text-xs px-2.5 py-1 rounded-full font-medium text-white shadow-sm"
                            style={{ backgroundColor: catInfo.color }}
                          >
                            {catInfo.emoji} {catInfo.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{loc.name}</h3>
                        <p className="text-sm text-slate-600 mb-4">{loc.ringkasan}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-0.5">Provinsi</span>
                            <span className="font-semibold text-slate-700">{loc.provinsi}</span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-0.5">Luas</span>
                            <span className="font-semibold text-slate-700">{loc.luas}</span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-0.5">Status</span>
                            <span className="font-semibold text-slate-700">{loc.status}</span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-0.5">TEV</span>
                            <span className="font-semibold text-slate-700">{loc.tev}</span>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = 'project/' + loc.id;
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors text-sm font-semibold shadow-sm"
                        >
                          <span>Lihat Detail Proyek</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Reset View Button */}
            <button 
              onClick={() => {
                setSelectedLocId(null);
                if (mapRef.current) {
                  mapRef.current.flyTo([-2.5, 118.0], 5, { duration: 1.5 });
                }
              }}
              title="Reset ke posisi semula"
              className="absolute top-4 right-4 z-[400] bg-white text-slate-700 px-3 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center gap-2 text-sm font-semibold group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">Reset Zoom</span>
            </button>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white border-l border-slate-200 flex flex-col z-10 shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  Daftar Lokasi
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold">
                  {filteredLocations.length}
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari lokasi..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredLocations.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Tidak ada lokasi yang cocok.
                </div>
              ) : (
                filteredLocations.map(loc => {
                  const catInfo = getCategoryInfo(loc.category);
                  const isSelected = selectedLocId === loc.id;
                  
                  return (
                    <div 
                      key={loc.id}
                      onClick={() => handleLocationClick(loc)}
                      className={`cursor-pointer p-3.5 rounded-xl border-l-4 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                          : 'bg-white border-transparent hover:bg-slate-50 border border-slate-100'
                      }`}
                      style={isSelected ? {} : { borderLeftColor: catInfo.color }}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm leading-tight flex-1">{loc.name}</h4>
                        <span 
                          className="shrink-0 text-[10px] px-2 py-0.5 rounded-full text-white font-medium shadow-sm"
                          style={{ backgroundColor: catInfo.color }}
                        >
                          {catInfo.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center mb-1">
                        <Navigation2 className="w-3 h-3 mr-1" /> {loc.provinsi}
                      </div>
                      <div className="flex items-center space-x-3 mt-2.5 pt-2.5 border-t border-slate-100/80 text-[11px] text-slate-600">
                        <span><strong>Luas:</strong> {loc.luas}</span>
                        <span><strong>Status:</strong> {loc.status}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {categories.map(cat => (
            <div key={cat.id} className="bg-slate-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm transition-transform hover:scale-105">
              <span className="text-3xl font-black mb-1.5" style={{ color: cat.color }}>
                {stats[cat.id] || 0}
              </span>
              <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <span>{cat.emoji}</span> {cat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
      
      {/* Global styles for custom Leaflet elements */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        .leaflet-popup-content {
          margin: 14px;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}} />
    </section>
  );
}
