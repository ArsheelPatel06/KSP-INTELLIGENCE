import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const mockData = [
  { time: '00:00', cyber: 10, violent: 2, property: 5 },
  { time: '04:00', cyber: 15, violent: 1, property: 8 },
  { time: '08:00', cyber: 35, violent: 5, property: 12 },
  { time: '12:00', cyber: 42, violent: 8, property: 20 },
  { time: '16:00', cyber: 55, violent: 12, property: 25 },
  { time: '20:00', cyber: 48, violent: 9, property: 18 },
  { time: '24:00', cyber: 25, violent: 4, property: 10 },
];

export const ForecastChart = () => {
  const { isDarkMode } = useApp();
  const [timeRange, setTimeRange] = useState('24H');
  const [filters, setFilters] = useState({ cyber: true, violent: true, property: true });

  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  const toggleFilter = (key) => setFilters(f => ({ ...f, [key]: !f[key] }));

  return (
    <div className="t-card animate-fade-in-up delay-300" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} style={{ color: '#8B5CF6' }} />
          Crime Forecast
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', padding: '0.25rem', borderRadius: '0.5rem' }}>
          {['LIVE', '24H', '1W', '1M'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                backgroundColor: timeRange === range ? 'var(--t-accent)' : 'transparent',
                color: timeRange === range ? '#FFF' : textSecondary,
                transition: 'all 0.2s ease'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => toggleFilter('cyber')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600, border: `1px solid ${filters.cyber ? '#3B82F6' : border}`, backgroundColor: filters.cyber ? 'rgba(59,130,246,0.1)' : 'transparent', color: filters.cyber ? '#3B82F6' : textSecondary, cursor: 'pointer' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} /> Cyber Fraud
        </button>
        <button onClick={() => toggleFilter('violent')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600, border: `1px solid ${filters.violent ? '#EF4444' : border}`, backgroundColor: filters.violent ? 'rgba(239,68,68,0.1)' : 'transparent', color: filters.violent ? '#EF4444' : textSecondary, cursor: 'pointer' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} /> Violent Crime
        </button>
        <button onClick={() => toggleFilter('property')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600, border: `1px solid ${filters.property ? '#10B981' : border}`, backgroundColor: filters.property ? 'rgba(16,185,129,0.1)' : 'transparent', color: filters.property ? '#10B981' : textSecondary, cursor: 'pointer' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} /> Property Theft
        </button>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1E293B' : '#E2E8F0'} vertical={false} />
            <XAxis dataKey="time" stroke={textSecondary} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={textSecondary} fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--t-bg-card)', borderColor: border, borderRadius: '0.5rem', color: textPrimary, fontSize: '0.75rem', fontWeight: 600 }}
              itemStyle={{ fontSize: '0.75rem' }}
            />
            {filters.cyber && <Line type="monotone" dataKey="cyber" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />}
            {filters.violent && <Line type="monotone" dataKey="violent" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />}
            {filters.property && <Line type="monotone" dataKey="property" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
