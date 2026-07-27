import React from 'react';
import { useApp } from '../../context/AppContext';
import { Server, Activity, Database, Cpu, HardDrive, Wifi, BrainCircuit, MessageSquare } from 'lucide-react';

// A tiny CSS-only sparkline
const Sparkline = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 40;
  const height = 16;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * height}`).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SystemHealth = () => {
  const { isDarkMode } = useApp();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  const systems = [
    { label: 'API Gateway', status: '24ms', icon: Wifi, color: '#3B82F6', spark: [20, 24, 22, 28, 24, 21, 24] },
    { label: 'GPU Cluster', status: '42%', icon: Cpu, color: '#8B5CF6', spark: [30, 45, 60, 40, 38, 45, 42] },
    { label: 'Vector Search', status: '12ms', icon: HardDrive, color: '#10B981', spark: [10, 15, 12, 11, 14, 12, 12] },
    { label: 'Redis Cache', status: '1ms', icon: Database, color: '#EF4444', spark: [1, 2, 1, 1, 3, 1, 1] },
    { label: 'Neo4j Graph', status: 'Operational', icon: Activity, color: '#F59E0B', spark: [100, 100, 95, 100, 98, 100, 100] },
    { label: 'Gemini AI', status: 'Healthy', icon: BrainCircuit, color: '#10B981', spark: [100, 98, 100, 100, 100, 99, 100] },
    { label: 'Postgres', status: 'Optimal', icon: Server, color: '#3B82F6', spark: [100, 100, 100, 100, 100, 100, 100] },
    { label: 'Kafka Stream', status: '2.1k/s', icon: MessageSquare, color: '#10B981', spark: [1.8, 2.0, 2.2, 2.1, 1.9, 2.3, 2.1] }
  ];

  return (
    <div className="t-card animate-fade-in-up delay-400" style={{ padding: '1.25rem' }}>
      <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Server size={18} style={{ color: '#06B6D4' }} />
        Infrastructure Status
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {systems.map(s => (
          <div key={s.label} className="t-card-alt" style={{ padding: '0.75rem', border: `1px solid ${border}`, borderRadius: '0.375rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: textSecondary, fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <s.icon size={12} style={{ color: s.color }} />
              {s.label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 800, color: textPrimary, fontSize: '0.875rem' }}>{s.status}</span>
              <Sparkline data={s.spark} color={s.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
