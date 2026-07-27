import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, BrainCircuit, Activity, Link as LinkIcon, Crosshair, Users, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PredictionDetailsDrawer = ({ isOpen, onClose, cluster }) => {
  const { isDarkMode } = useApp();
  const navigate = useNavigate();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  if (!isOpen || !cluster) return null;

  return (
    <>
      <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="animate-slide-in" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', backgroundColor: isDarkMode ? '#0B1120' : '#FFFFFF', zIndex: 1000, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${border}`, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `${cluster.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${cluster.color}30` }}>
              <BrainCircuit size={18} style={{ color: cluster.color }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: textPrimary, fontSize: '1rem' }}>{cluster.title}</div>
              <div style={{ fontSize: '0.6875rem', color: textSecondary, fontWeight: 600 }}>Confidence: <span style={{ color: cluster.color }}>{cluster.confidence}%</span></div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>AI Reasoning</div>
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', color: textPrimary, fontSize: '0.875rem', lineHeight: 1.5 }}>
              Sentinel AI detected a pattern of similar modus operandi across multiple jurisdictions. The timing and target demographics match a known syndicate profile.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Linked Evidence</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {cluster.evidence.map((ev, i) => (
                <div key={i} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ev.icon size={16} style={{ color: textSecondary }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: textPrimary }}>{ev.value}</div>
                    <div style={{ fontSize: '0.625rem', color: textSecondary }}>{ev.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Entities Involved</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2].map(i => (
                <div key={i} onClick={() => navigate(`/network`)} className="t-card-alt-hover" style={{ padding: '0.75rem', border: `1px solid ${border}`, borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={14} style={{ color: '#3B82F6' }} />
                    </div>
                    <span style={{ fontWeight: 600, color: textPrimary, fontSize: '0.875rem' }}>Suspect {i} (Unknown)</span>
                  </div>
                  <LinkIcon size={14} style={{ color: textSecondary }} />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem', borderTop: `1px solid ${border}`, backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', color: textPrimary, border: `1px solid ${border}`, borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            Dismiss
          </button>
          <button onClick={() => { onClose(); navigate('/cases'); }} style={{ flex: 2, padding: '0.75rem', backgroundColor: 'var(--t-accent)', color: '#FFF', border: 'none', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Activity size={16} /> Open Investigation
          </button>
        </div>
      </div>
    </>
  );
};
