import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Info, Clock, ChevronRight } from 'lucide-react';

const initialFeed = [
  { id: 1, type: 'critical', text: 'Multiple cyber complaints registered from Indiranagar.', time: 'Just now', icon: ShieldAlert, color: '#EF4444' },
  { id: 2, type: 'warning', text: 'Vehicle KA-01-EG-1234 flagged at Silk Board junction.', time: '2 mins ago', icon: AlertTriangle, color: '#F59E0B' },
  { id: 3, type: 'info', text: 'Officer deployment optimized for Night Beat.', time: '15 mins ago', icon: Info, color: '#3B82F6' },
];

export const LiveFeed = () => {
  const { isDarkMode } = useApp();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(initialFeed);
  
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  // Fake WebSocket hook to occasionally push new items
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        setFeed(prev => {
          const newItem = {
            id: Date.now(),
            type: 'warning',
            text: 'Anomaly detected in incoming 112 calls from Zone A.',
            time: 'Just now',
            icon: AlertTriangle,
            color: '#F59E0B'
          };
          // Keep only top 4
          return [newItem, ...prev].slice(0, 4);
        });
      }
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="t-card animate-fade-in-up delay-100" style={{ padding: '1.25rem' }}>
      <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={18} style={{ color: '#3B82F6' }} />
        Live Intelligence Feed
        <span className="animate-pulse-glow" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EF4444', marginLeft: 'auto' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {feed.map((item) => (
          <div 
            key={item.id} 
            className="animate-slide-in t-card-alt-hover" 
            onClick={() => navigate('/cases')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', borderRadius: '0.5rem', borderLeft: `2px solid ${item.color}`, cursor: 'pointer' }}
          >
            <item.icon size={16} style={{ color: item.color, flexShrink: 0, marginTop: '0.125rem' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: textPrimary, lineHeight: 1.4 }}>{item.text}</div>
              <div style={{ fontSize: '0.625rem', color: textSecondary, marginTop: '0.25rem', fontWeight: 500 }}>{item.time}</div>
            </div>
            <ChevronRight size={14} style={{ color: textSecondary }} />
          </div>
        ))}
      </div>
    </div>
  );
};
