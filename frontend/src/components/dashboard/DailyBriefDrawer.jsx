import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, CheckCircle, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DailyBriefDrawer = ({ isOpen, onClose }) => {
  const { isDarkMode } = useApp();
  const navigate = useNavigate();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  if (!isOpen) return null;

  return (
    <>
      <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="animate-slide-in" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: isDarkMode ? '#0B1120' : '#FFFFFF', zIndex: 1000, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${border}`, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.3)' }}>
              <ShieldAlert size={18} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: textPrimary, fontSize: '1rem' }}>Daily Intelligence Brief</div>
              <div style={{ fontSize: '0.6875rem', color: textSecondary, fontWeight: 600 }}>DCP V. Rathore</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>AI Summary</div>
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(59,130,246,0.05)', border: `1px solid rgba(59,130,246,0.2)`, color: textPrimary, fontSize: '0.875rem', lineHeight: 1.5 }}>
              Over the last 24 hours, Sentinel AI has analyzed 1,000 FIRs. A <strong style={{ color: '#EF4444' }}>high-risk cyber fraud cluster</strong> has emerged in Indiranagar. Patrol units in Zone A are operating at optimal efficiency.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Top Priority Cases</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2].map(i => (
                <div key={i} onClick={() => navigate(`/cases/FIR-0${i}`)} className="t-card-alt-hover" style={{ padding: '0.75rem', border: `1px solid ${border}`, borderRadius: '0.5rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: textPrimary, fontSize: '0.875rem' }}>FIR-2024-08{i}</span>
                    <span style={{ fontSize: '0.6875rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontWeight: 700 }}>Critical</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: textSecondary }}>Linked to Cyber Fraud Cluster in Indiranagar.</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Recommendations</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: `1px solid ${border}`, borderRadius: '0.5rem' }}>
              <CheckCircle size={16} style={{ color: '#10B981', flexShrink: 0 }} />
              <div style={{ fontSize: '0.8125rem', color: textPrimary }}>Approve deployment of 2 extra patrol units to Indiranagar for the night beat.</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem', borderTop: `1px solid ${border}`, backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC' }}>
          <button onClick={() => { onClose(); navigate('/analytics'); }} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <BrainCircuit size={16} /> Open Full Threat Analysis
          </button>
        </div>
      </div>
    </>
  );
};
