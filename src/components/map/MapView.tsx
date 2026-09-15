import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import { LandCoverPolygon } from '../../types/spatial';
import { formatIDR, formatNumber } from '../../utils/formatter';
import { MapLegend } from './MapLegend';
import { MapLayerControl } from './MapLayerControl';
import { PolygonDetailDrawer } from './PolygonDetailDrawer';
import { useProject } from '../../context/ProjectContext';

interface MapViewProps {
  selectedPolygonId?: string | null;
  onPolygonSelect?: (poly: LandCoverPolygon | null) => void;
  landCovers?: LandCoverPolygon[];
  layers?: MapLayer[];
}

// Color map for Land Cover types
const COLOR_SCHEME: Record<string, { fill: string; stroke: string }> = {
  mangrove: { fill: '#10b981', stroke: '#047857' },
  lamun: { fill: '#14b8a6', stroke: '#0f766e' },
  terumbu_karang: { fill: '#f97316', stroke: '#c2410c' },
  perairan: { fill: '#38bdf8', stroke: '#0284c7' },
  lainnya: { fill: '#facc15', stroke: '#ca8a04' },
};

// Map center adjuster component
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center[0], center[1], zoom, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  selectedPolygonId,
  onPolygonSelect,
  landCovers: propLandCovers,
  layers: propLayers,
}) => {
  const context = useProject();
  const landCovers = propLandCovers || context.landCovers;
  const layers = propLayers || context.layers;
  const [internalSelected, setInternalSelected] = useState<LandCoverPolygon | null>(null);

  // Check if tutupan lahan layer is visible
  const isTutupanVisible = layers.find(l => l.name.includes('Tutupan'))?.visible ?? true;
  const isIndexVisible = layers.find(l => l.name.includes('Index'))?.visible ?? true;

  const currentPolygon = selectedPolygonId
    ? landCovers.find(p => p.id === selectedPolygonId) || internalSelected
    : internalSelected;

  const handlePolygonClick = (poly: LandCoverPolygon) => {
    setInternalSelected(poly);
    if (onPolygonSelect) onPolygonSelect(poly);
  };

  const handleCloseDrawer = () => {
    setInternalSelected(null);
    if (onPolygonSelect) onPolygonSelect(null);
  };

  // Center of project features or fallback to Teluk Benoa, Bali
  const defaultCenter: [number, number] = landCovers[0]?.center || [-8.745, 115.215];

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-lg overflow-hidden border border-slate-200 shadow-inner">
      {/* Interactive Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%', minHeight: '520px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={currentPolygon?.center || defaultCenter} />

        {/* Render Land Cover Polygons */}
        {isTutupanVisible &&
          landCovers.map((poly) => {
            const isSelected = currentPolygon?.id === poly.id;
            const colors = COLOR_SCHEME[poly.type] || COLOR_SCHEME.lainnya;

            return (
              <Polygon
                key={poly.id}
                positions={poly.coordinates}
                pathOptions={{
                  color: isSelected ? '#1e40af' : colors.stroke,
                  fillColor: colors.fill,
                  fillOpacity: isSelected ? 0.75 : 0.45,
                  weight: isSelected ? 3.5 : 2,
                  dashArray: isSelected ? '4, 4' : undefined,
                }}
                eventHandlers={{
                  click: () => handlePolygonClick(poly),
                }}
              >
                <Tooltip direction="center" permanent={isIndexVisible} opacity={0.95}>
                  <div className="text-center font-sans">
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      {poly.name}
                    </div>
                    {isIndexVisible && (
                      <div className={`text-[9px] font-mono font-semibold mt-0.5 px-1.5 py-0.5 rounded border ${
                        poly.indexCode ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        {poly.indexCode ? `${poly.indexCode} • ` : '⚠ Belum Ada Index • '}{formatNumber(poly.areaHa)} ha
                      </div>
                    )}
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
      </MapContainer>

      {/* Floating GIS Overlay: Legend (Bottom-Left) */}
      <div className="absolute bottom-5 left-4 z-20 pointer-events-auto">
        <MapLegend />
      </div>

      {/* Floating GIS Overlay: Layer Switcher (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <MapLayerControl />
      </div>

      {/* Slide-in Detail Drawer on Polygon Click */}
      <PolygonDetailDrawer
        polygon={currentPolygon}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};
