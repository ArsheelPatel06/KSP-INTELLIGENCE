import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Car, FileText, User, Upload } from 'lucide-react';

export const IntelligenceTimeline = () => {
  const { isDarkMode } = useApp();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  const timelineEvents = [
    { time: '15:58', label: 'AI detected anomaly', icon: Activity, color: '#F59E0B' },
    { time: '16:01', label: 'Vehicle matched', icon: Car, color: '#3B82F6' },
    { time: '16:04', label: 'FIR linked', icon: FileText, color: '#10B981' },
    { time: '16:08', label: 'Officer assigned', icon: User, color: '#8B5CF6' },
    { time: '16:10', label: 'Evidence uploaded', icon: Upload, color: '#EF4444' }
  ];

  return (
    <div className="t-card animate-fade-in-up delay-600" style={{ padding: '1.25rem', overflowX: 'auto' }}>
      <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={18} style={{ color: '#F59E0B' }} />
        Active Investigation Timeline
      </div>

      <div style={{ display: 'flex', alignItems: 'center', minWidth: '600px', paddingBottom: '0.5rem' }}>
        {timelineEvents.map((event, idx) => (
          <React.Fragment key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', position: 'relative', width: '120px', zIndex: 10 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: textPrimary }}>{event.time}</div>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `${event.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: event.color, border: `1px solid ${event.color}40`, zIndex: 10, position: 'relative' }}>
                <event.icon size={16} strokeWidth={2.5} />
                {idx === timelineEvents.length - 1 && (
                  <span className="animate-pulse-glow" style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `1px solid ${event.color}` }} />
                )}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textAlign: 'center', lineHeight: 1.2 }}>{event.label}</div>
            </div>
            {idx < timelineEvents.length - 1 && (
              <div style={{ flex: 1, height: '2px', backgroundColor: `${event.color}40`, position: 'relative', top: '-2px', minWidth: '40px' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
