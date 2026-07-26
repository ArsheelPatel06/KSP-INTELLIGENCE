import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ShieldAlert, MapPin, Eye, Filter, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';

// Fix standard Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons for Crime Markers
const createCustomIcon = (priority) => {
  const color = priority === 'Critical' ? '#EF4444' :
                priority === 'High' ? '#F59E0B' :
                priority === 'Medium' ? '#3B82F6' : '#06B6D4';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28" stroke="#0F172A" stroke-width="1.5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-marker-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

export const CrimeMapComponent = ({ firs = [], selectedDistrict = 'All', onSelectFir }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const navigate = useNavigate();

  const filteredFirs = firs.filter(fir => {
    if (selectedDistrict === 'All') return true;
    return fir.district === selectedDistrict;
  }).slice(0, 150); // Slice for smooth rendering performance

  const defaultCenter = [12.9716, 77.5946]; // Bengaluru default

  return (
    <div className="relative w-full h-[650px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Map Layer Control Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-[#131B2E]/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold">
          <Layers size={14} className="text-blue-400" />
          <span>Map Overlays:</span>
        </div>
        <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
          />
          <span>Hotspot Heatmap</span>
        </label>
        <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={showStations}
            onChange={(e) => setShowStations(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
          />
          <span>Police Stations</span>
        </label>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Dark CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Heatmap Circle Overlay Simulation */}
        {showHeatmap && filteredFirs.slice(0, 40).map((fir) => (
          <CircleMarker
            key={`heat-${fir.id}`}
            center={[fir.location.lat, fir.location.lng]}
            radius={25}
            pathOptions={{
              fillColor: fir.priority === 'Critical' ? '#EF4444' : '#F59E0B',
              fillOpacity: 0.25,
              stroke: false
            }}
          />
        ))}

        {/* FIR Incident Pins */}
        {filteredFirs.map((fir) => (
          <Marker
            key={fir.id}
            position={[fir.location.lat, fir.location.lng]}
            icon={createCustomIcon(fir.priority)}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <span className="font-bold text-xs text-blue-400">{fir.firNumber}</span>
                  <Badge
                    variant={fir.priority === 'Critical' ? 'danger' : fir.priority === 'High' ? 'warning' : 'primary'}
                    size="sm"
                  >
                    {fir.priority}
                  </Badge>
                </div>
                <p className="font-semibold text-xs text-slate-100">{fir.crimeType}</p>
                <p className="text-[11px] text-slate-400 mt-1">{fir.location.address}</p>
                <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                  <span>Status: <strong className="text-slate-200">{fir.status}</strong></span>
                  <span>Date: {fir.incidentDate}</span>
                </div>
                <button
                  onClick={() => {
                    if (onSelectFir) onSelectFir(fir);
                    navigate(`/cases/${fir.id}`);
                  }}
                  className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye size={12} />
                  <span>Inspect FIR Case</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
