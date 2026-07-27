import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Map as MapIcon, Shield, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AreaSummaryDrawer = ({ isOpen, onClose, area }) => {
  const { isDarkMode } = useApp();
  const navigate = useNavigate();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  if (!isOpen || !area) return null;

  return (
    <>
      <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="animate-slide-in" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: isDarkMode ? '#0B1120' : '#FFFFFF', zIndex: 1000, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${border}`, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `${area.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${area.color}30` }}>
              <MapIcon size={18} style={{ color: area.color }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: textPrimary, fontSize: '1rem' }}>{area.label}</div>
              <div style={{ fontSize: '0.6875rem', color: textSecondary, fontWeight: 600 }}>Zone: <span style={{ color: area.color }}>{area.type}</span></div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Area Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', border: `1px solid ${border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: textPrimary }}>14</div>
                <div style={{ fontSize: '0.625rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 700 }}>Active Cases</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', border: `1px solid ${border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: textPrimary }}>2</div>
                <div style={{ fontSize: '0.625rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 700 }}>Patrol Units</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Recent Incidents</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} onClick={() => navigate(`/cases/FIR-0${i}`)} className="t-card-alt-hover" style={{ padding: '0.75rem', border: `1px solid ${border}`, borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={14} style={{ color: '#EF4444' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: textPrimary, fontSize: '0.875rem' }}>Cyber Fraud Report {i}</div>
                    <div style={{ fontSize: '0.6875rem', color: textSecondary }}>{i * 2} hours ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem', borderTop: `1px solid ${border}`, backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { onClose(); navigate('/map'); }} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--t-accent)', color: '#FFF', border: 'none', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <MapIcon size={16} /> Open Full Map
          </button>
        </div>
      </div>
    </>
  );
};
