import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import { useApp } from '../../context/AppContext';
import { Map as MapIcon, ShieldAlert } from 'lucide-react';
import L from 'leaflet';
import { AreaSummaryDrawer } from './AreaSummaryDrawer';

const PulseMarker = ({ position, color, size, onClick }) => {
  const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="position:relative; width:${size}px; height:${size}px;">
             <div class="animate-radar" style="position:absolute; inset:-50%; border:2px solid ${color}; border-radius:50%;"></div>
             <div style="position:absolute; inset:0; background-color:${color}; border-radius:50%; box-shadow:0 0 10px ${color};"></div>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
  return <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }} />;
};

export const InteractiveCrimeMap = () => {
  const { isDarkMode } = useApp();
  const [selectedArea, setSelectedArea] = React.useState(null);
  const textPrimary = 'var(--t-text-primary)';
  const border = 'var(--t-border)';

  const mapUrl = isDarkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const hotspots = [
    { pos: [12.9716, 77.5946], color: '#EF4444', label: 'Indiranagar Cluster', type: 'High Risk' },
    { pos: [12.9352, 77.6245], color: '#F59E0B', label: 'Koramangala', type: 'Elevated' }
  ];

  return (
    <div className="t-card animate-fade-in-up delay-400" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapIcon size={18} style={{ color: '#F59E0B' }} />
        Interactive Crime Map
      </div>

      <div style={{ flex: 1, minHeight: '400px', position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${border}` }}>
        <MapContainer center={[12.9716, 77.5946]} zoom={12} zoomControl={false} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url={mapUrl}
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
          />
          {hotspots.map((h, idx) => (
            <React.Fragment key={idx}>
              <Circle 
                center={h.pos} 
                pathOptions={{ fillColor: h.color, fillOpacity: 0.2, color: h.color, weight: 1, className: 'leaflet-interactive' }} 
                radius={1500} 
                eventHandlers={{ click: () => setSelectedArea(h) }} 
              />
              <PulseMarker position={h.pos} color={h.color} size={12} onClick={() => setSelectedArea(h)} />
            </React.Fragment>
          ))}
        </MapContainer>
        
        {/* Overlays */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 400, display: 'flex', gap: '0.5rem' }}>
          {['Hotspots', 'Patrols', 'Predictions'].map(layer => (
            <div key={layer} style={{ backgroundColor: isDarkMode ? 'rgba(11,17,32,0.8)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, color: textPrimary, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: layer === 'Hotspots' ? '#EF4444' : layer === 'Patrols' ? '#3B82F6' : '#10B981' }} />
              {layer}
            </div>
          ))}
        </div>
      </div>
      <AreaSummaryDrawer isOpen={!!selectedArea} onClose={() => setSelectedArea(null)} area={selectedArea} />
    </div>
  );
};
