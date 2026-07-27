import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';
import { Btn } from '../components/common/ButtonSystem';

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
    Critical: { bg: 'bg-red-50', color: 'text-red-600', border: 'border-red-200' },
    High:     { bg: 'bg-orange-50', color: 'text-orange-600', border: 'border-orange-200' },
    Medium:   { bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-200' },
  }[sev] || { bg: 'bg-slate-50', color: 'text-slate-500', border: 'border-slate-200' });

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 pb-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <Bell size={24} className="text-blue-600" />
            Alerts &amp; Real-time Intelligence Feed
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Automated notifications for high priority matches, crime spikes, and AI link analysis.
          </p>
        </div>
        <Btn variant="secondary" size="sm" icon={CheckCircle2} onClick={markAllNotificationsRead}>
          Mark All as Read
        </Btn>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {['All', 'Unread', 'Critical', 'High', 'Medium'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all border ${
              filterSeverity === sev 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {sev} Alerts
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const sc = severityColor(notif.severity);
            return (
              <div
                key={notif.id}
                onClick={() => { markNotificationRead(notif.id); if (notif.link) navigate(notif.link); }}
                className={`flex items-start justify-between gap-4 p-5 rounded-[16px] cursor-pointer transition-all ${
                  notif.read 
                    ? 'bg-slate-50/50 border border-transparent hover:bg-slate-50' 
                    : 'bg-white border border-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-[1px]'
                }`}
                style={{ opacity: notif.read ? 0.75 : 1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-[12px] border flex-shrink-0 ${sc.bg} ${sc.color} ${sc.border}`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-extrabold text-[15px] text-slate-900">{notif.title}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase border ${
                        notif.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                        notif.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {notif.category}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed max-w-2xl">{notif.message}</p>
                    <span className="text-[11px] text-slate-400 font-bold mt-2 block font-mono">{notif.timestamp}</span>
                  </div>
                </div>
                <ExternalLink size={18} className="text-slate-300 flex-shrink-0 mt-1" />
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 text-center p-12 text-slate-500 font-bold text-[14px] rounded-[18px]">
            No matching notifications found.
          </div>
        )}
      </div>
    </div>
  );
};
