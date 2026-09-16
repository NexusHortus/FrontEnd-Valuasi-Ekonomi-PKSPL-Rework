import React, { useState } from 'react';
import { ArrowLeft, MapPin, Shield, TrendingUp, Activity, FileText, Map as MapIcon, Clock, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { getLocationById, getCategoryInfo } from './mapData';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ProjectDetailPage({ projectId, onBack }) {
  const [activeTab, setActiveTab] = useState('deskripsi');

  const loc = getLocationById(projectId);
  if (!loc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Proyek tidak ditemukan</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Peta
        </button>
      </div>
    );
  }

  const category = getCategoryInfo(loc.category);

  const tabs = [
    { id: 'deskripsi', label: 'Deskripsi & Potensi', icon: FileText },
    { id: 'peta', label: 'Peta Lokasi', icon: MapIcon },
    { id: 'riwayat', label: 'Riwayat Aktivitas', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Kembali ke Peta</span>
        </button>
        <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate px-4">{loc.name}</h1>
        {category && (
          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1.5 whitespace-nowrap`} style={{ backgroundColor: category.color }}>
            <span>{category.emoji}</span>
            <span className="hidden sm:inline">{category.label}</span>
          </div>
        )}
      </header>

      {/* Hero Banner */}
      <div 
        className="h-48 relative flex items-center px-6"
        style={{ 
          background: category ? `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)` : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
        }}
      >
        <div className="max-w-6xl mx-auto w-full text-white z-10 pt-4">
          <h2 className="text-3xl font-bold mb-2">{loc.name}</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium opacity-90">
            <span className="bg-white/20 px-2 py-1 rounded">{loc.provinsi}</span>
            <span>•</span>
            <span>{loc.kabupaten}</span>
            <span>•</span>
            <span className="font-mono text-xs bg-white/20 px-2 py-1 rounded">{loc.coords[0].toFixed(5)}, {loc.coords[1].toFixed(5)}</span>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-20 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full" style={{ backgroundColor: category ? `${category.color}1a` : '#eff6ff' }}>
            <MapPin className="w-6 h-6" style={{ color: category ? category.color : '#3b82f6' }} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Luas Area</div>
            <div className="font-bold text-lg text-slate-800">{loc.luas}</div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full" style={{ backgroundColor: category ? `${category.color}1a` : '#eff6ff' }}>
            <Shield className="w-6 h-6" style={{ color: category ? category.color : '#3b82f6' }} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Status Kawasan</div>
            <div className="font-bold text-lg text-slate-800">{loc.status}</div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full" style={{ backgroundColor: category ? `${category.color}1a` : '#eff6ff' }}>
            <TrendingUp className="w-6 h-6" style={{ color: category ? category.color : '#3b82f6' }} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Estimasi TEV</div>
            <div className="font-bold text-lg text-slate-800">{loc.tev}</div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full" style={{ backgroundColor: category ? `${category.color}1a` : '#eff6ff' }}>
            <Activity className="w-6 h-6" style={{ color: category ? category.color : '#3b82f6' }} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Titik Pantau</div>
            <div className="font-bold text-lg text-slate-800">{loc.jumlahTitikPantau}</div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 mt-8 flex-1 pb-16">
        {/* Tab Bar */}
        <div className="flex space-x-1 border-b border-slate-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          {/* Deskripsi Tab */}
          {activeTab === 'deskripsi' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {loc.ringkasan && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-blue-900">
                  <p className="font-medium italic">{loc.ringkasan}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Deskripsi Lengkap</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{loc.deskripsi || 'Belum ada deskripsi untuk lokasi ini.'}</p>
              </div>

              {loc.spesies && loc.spesies.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Spesies Utama</h3>
                  <div className="flex flex-wrap gap-2">
                    {loc.spesies.map((sp, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-sm font-medium">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Peta Tab */}
          {activeTab === 'peta' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="h-[400px] rounded-xl overflow-hidden shadow-inner border border-slate-200">
                <MapContainer center={loc.coords} zoom={10} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={loc.coords}>
                    <Popup>
                      <strong>{loc.name}</strong><br/>
                      {loc.provinsi}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Koordinat:</span> {loc.coords[0].toFixed(6)}, {loc.coords[1].toFixed(6)}
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.coords[0]},${loc.coords[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                >
                  Buka di Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Riwayat Tab */}
          {activeTab === 'riwayat' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Riwayat Pemantauan & Aktivitas</h3>
              
              {(!loc.riwayat || loc.riwayat.length === 0) ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Belum ada catatan riwayat untuk proyek ini.</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-200 ml-3 md:ml-4 space-y-8 pb-4">
                  {loc.riwayat
                    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                    .map((item, idx) => (
                    <div key={idx} className="relative pl-6 md:pl-8">
                      {/* Timeline dot */}
                      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                      
                      <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4 hover:shadow-md transition">
                        <div className="text-sm font-medium text-blue-600 mb-1">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <h4 className="text-base font-bold text-slate-800 mb-2">{item.aktivitas}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
