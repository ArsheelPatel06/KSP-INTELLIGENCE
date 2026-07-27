import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldAlert, Users, BrainCircuit, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, meta, trend, dataPoints, icon: Icon, color, delay, onClick }) => {
  const { isDarkMode } = useApp();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  return (
    <div onClick={onClick} className={`t-card animate-fade-in-up delay-${delay}`} style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden', cursor: 'pointer', group: 'true' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: textSecondary, marginBottom: '0.25rem' }}>{title}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: textPrimary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {value}
            <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: trend === 'up' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: trend === 'up' ? '#EF4444' : '#10B981', display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {meta}
            </span>
          </div>
        </div>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
          <Icon size={20} />
        </div>
      </div>

      {/* Mini Bar Chart instead of raw text bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '1.5rem', marginTop: '1rem' }}>
        {dataPoints.map((val, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: i === dataPoints.length - 1 ? color : isDarkMode ? '#1E293B' : '#E2E8F0', height: `${val}%`, borderRadius: '2px 2px 0 0', opacity: i === dataPoints.length - 1 ? 1 : 0.6 }} />
        ))}
      </div>
      <div style={{ fontSize: '0.625rem', color: textSecondary, marginTop: '0.25rem', textAlign: 'right' }}>7 Day Trend</div>

      {/* Hover Overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: isDarkMode ? 'rgba(11,17,32,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease', zIndex: 10 }} className="kpi-hover-overlay">
        <button style={{ padding: '0.5rem 1rem', borderRadius: '9999px', backgroundColor: 'var(--t-accent)', color: '#FFF', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          Open Analytics <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
};

export const KPIGrid = () => {
  const navigate = useNavigate();
  const kpiData = [
    { title: 'Active FIRs', value: '1,024', meta: 'Today +14', trend: 'up', icon: Activity, color: '#3B82F6', delay: 100, dataPoints: [40, 50, 45, 60, 55, 70, 85] },
    { title: 'Open Investigations', value: '142', meta: 'This Week -3', trend: 'down', icon: Users, color: '#8B5CF6', delay: 200, dataPoints: [80, 75, 78, 65, 60, 55, 50] },
    { title: 'High Risk Clusters', value: '27', meta: 'Action Required', trend: 'up', icon: ShieldAlert, color: '#EF4444', delay: 300, dataPoints: [20, 25, 22, 40, 35, 45, 60] },
    { title: 'AI Prediction Accuracy', value: '94.2%', meta: 'Top 10%', trend: 'up', icon: BrainCircuit, color: '#10B981', delay: 400, dataPoints: [85, 87, 88, 90, 91, 93, 94] }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .t-card:hover .kpi-hover-overlay { opacity: 1 !important; }
      `}} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {kpiData.map((kpi, idx) => <KPICard key={idx} {...kpi} onClick={() => navigate('/analytics')} />)}
      </div>
    </>
  );
};
