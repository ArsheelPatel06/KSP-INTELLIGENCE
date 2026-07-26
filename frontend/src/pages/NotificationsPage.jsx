import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filteredNotifications = notifications.filter((n) => {
    if (filterSeverity === 'Unread') return !n.read;
    if (filterSeverity !== 'All' && n.severity !== filterSeverity) return false;
    return true;
  });

  const severityColor = (sev) => ({
    Critical: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
    High:     { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
    Medium:   { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
  }[sev] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B', border: 'rgba(100,116,139,0.2)' });

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="t-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderRadius: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--t-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} style={{ color: '#3B82F6' }} />
            Alerts &amp; Real-time Intelligence Feed
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--t-text-secondary)', marginTop: '0.25rem' }}>
            Automated notifications for high priority matches, crime spikes, and AI link analysis.
          </p>
        </div>
        <button
          onClick={markAllNotificationsRead}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <CheckCircle2 size={14} /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--t-border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        {['All', 'Unread', 'Critical', 'High', 'Medium'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '1px solid',
              backgroundColor: filterSeverity === sev ? '#1E3A8A' : 'var(--t-bg-card-alt)',
              color: filterSeverity === sev ? '#FFFFFF' : 'var(--t-text-secondary)',
              borderColor: filterSeverity === sev ? '#1E3A8A' : 'var(--t-border)',
              transition: 'all 0.15s'
            }}
          >
            {sev} Alerts
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const sc = severityColor(notif.severity);
            return (
              <div
                key={notif.id}
                onClick={() => { markNotificationRead(notif.id); if (notif.link) navigate(notif.link); }}
                style={{
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
                  padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                  backgroundColor: notif.read ? 'var(--t-bg-card-alt)' : 'var(--t-bg-card)',
                  border: `1px solid ${notif.read ? 'var(--t-border)' : 'rgba(59,130,246,0.35)'}`,
                  boxShadow: notif.read ? 'none' : '0 0 0 1px rgba(59,130,246,0.1)',
                  transition: 'all 0.15s', opacity: notif.read ? 0.75 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{ padding: '0.625rem', borderRadius: '0.5rem', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, flexShrink: 0 }}>
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--t-text-primary)' }}>{notif.title}</span>
                      <Badge variant={notif.severity === 'Critical' ? 'danger' : notif.severity === 'High' ? 'warning' : 'primary'}>
                        {notif.category}
                      </Badge>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--t-text-secondary)', lineHeight: 1.6 }}>{notif.message}</p>
                    <span style={{ fontSize: '0.625rem', color: 'var(--t-text-muted)', marginTop: '0.5rem', display: 'block', fontFamily: 'monospace' }}>{notif.timestamp}</span>
                  </div>
                </div>
                <ExternalLink size={16} style={{ color: '#3B82F6', flexShrink: 0 }} />
              </div>
            );
          })
        ) : (
          <div className="t-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--t-text-muted)', fontSize: '0.875rem', borderRadius: '0.75rem' }}>
            No matching notifications found.
          </div>
        )}
      </div>
    </div>
  );
};
