import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Crosshair, Map, Users, Link as LinkIcon, Shield } from 'lucide-react';
import { PredictionDetailsDrawer } from './PredictionDetailsDrawer';
import { useNavigate } from 'react-router-dom';

export const IntelligenceCenter = () => {
  const { isDarkMode } = useApp();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';
  const [selectedCluster, setSelectedCluster] = React.useState(null);
  const navigate = useNavigate();

  const clusters = [
    {
      title: 'Cyber Fraud Cluster',
      confidence: 98,
      color: '#EF4444',
      evidence: [
        { icon: Crosshair, value: '14 FIRs', label: 'Linked' },
        { icon: Map, value: '3 Districts', label: 'Affected' },
        { icon: Users, value: '12 Suspects', label: 'Identified' },
        { icon: LinkIcon, value: '2 Gangs', label: 'Related' }
      ],
      actions: ['Deploy Unit', 'Freeze Accounts', 'Open Investigation']
    },
    {
      title: 'Vehicle Theft Syndicate',
      confidence: 84,
      color: '#F59E0B',
      evidence: [
        { icon: Crosshair, value: '8 FIRs', label: 'Linked' },
        { icon: Map, value: '1 District', label: 'Affected' },
        { icon: Users, value: '4 Suspects', label: 'Identified' },
        { icon: LinkIcon, value: 'None', label: 'Related' }
      ],
      actions: ['Increase Patrols', 'Open Investigation']
    }
  ];

  return (
    <div className="t-card animate-fade-in-up delay-200" style={{ padding: '1.25rem' }}>
      <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={18} style={{ color: '#EF4444' }} />
        AI Intelligence Center
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {clusters.map((cluster, idx) => (
          <div 
            key={idx} 
            className="t-card-alt t-card-alt-hover" 
            onClick={() => setSelectedCluster(cluster)}
            style={{ padding: '1rem', border: `1px solid ${border}`, borderRadius: '0.5rem', cursor: 'pointer' }}
          >
            
            {/* Header & Confidence */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.875rem' }}>{cluster.title}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: cluster.color }}>Confidence {cluster.confidence}%</div>
            </div>

            {/* Real Progress Bar */}
            <div style={{ height: '6px', backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ width: `${cluster.confidence}%`, height: '100%', backgroundColor: cluster.color, borderRadius: '9999px' }} />
            </div>

            {/* Evidence Grid */}
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Evidence Base</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {cluster.evidence.map((ev, i) => (
                <div key={i} style={{ backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                  <ev.icon size={14} style={{ color: textSecondary, margin: '0 auto 0.25rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textPrimary }}>{ev.value}</div>
                  <div style={{ fontSize: '0.625rem', color: textSecondary }}>{ev.label}</div>
                </div>
              ))}
            </div>

            {/* AI Recommendations */}
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>AI Recommendations</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {cluster.actions.map((action, i) => (
                <button key={i} style={{ 
                  padding: '0.375rem 0.75rem', 
                  borderRadius: '0.25rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  border: action === 'Open Investigation' ? 'none' : `1px solid ${border}`,
                  backgroundColor: action === 'Open Investigation' ? 'var(--t-accent)' : 'transparent',
                  color: action === 'Open Investigation' ? '#FFF' : textPrimary,
                  transition: 'all 0.15s ease'
                }} onClick={(e) => {
                  e.stopPropagation();
                  if (action === 'Open Investigation') navigate('/cases');
                  else setSelectedCluster(cluster);
                }}>
                  {action}
                </button>
              ))}
            </div>

          </div>
        ))}
      </div>
      <PredictionDetailsDrawer isOpen={!!selectedCluster} onClose={() => setSelectedCluster(null)} cluster={selectedCluster} />
    </div>
  );
};
