import React from 'react';
import { UserX, UserCheck, Phone, Car, MapPin, Activity, ShieldAlert, HeartPulse, FileCheck2 } from 'lucide-react';
import { Btn, BtnIcon } from '../../common/ButtonSystem';

const avatarColors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500'];
const getAvatarColor = (n = '') => avatarColors[n.charCodeAt(0) % avatarColors.length];
const getInitials    = (n = '') => n.split(' ').filter(Boolean).slice(0,2).map(c=>c[0]).join('').toUpperCase();

export const SuspectsVictimsTab = ({ fir, onOpenDrawer }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Suspects Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserX size={16} className="text-rose-500" />
          <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">
            Suspects & Persons of Interest
          </h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {fir.suspects?.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold shadow-sm ${getAvatarColor(s.name)}`}>
                      {getInitials(s.name)}
                    </div>
                    <div>
                      <h4 className="text-[16px] font-extrabold text-slate-900 leading-tight">{s.name}</h4>
                      <div className="text-[12px] font-bold text-slate-500 mt-0.5">Alias: {s.alias || s.knownAlias || '—'}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                      s.status === 'In Custody' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}>{s.status}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border text-red-700 bg-red-50 border-red-200 flex items-center gap-1">
                      <ShieldAlert size={10} /> HIGH RISK
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><Activity size={14} className="text-slate-400" /> Age: <strong className="text-slate-800">{s.age}</strong></div>
                   <div className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><UserX size={14} className="text-slate-400" /> Gang: <strong className="text-slate-800">{s.gang || 'West Syndicate'}</strong></div>
                   <div className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><Car size={14} className="text-slate-400" /> Vehicle: <strong className="text-slate-800">{s.vehicle || 'Unknown'}</strong></div>
                   <div className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> Phone: <strong className="text-slate-800">{s.phone}</strong></div>
                   <div className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5 col-span-2"><MapPin size={14} className="text-slate-400" /> Last Seen: <strong className="text-slate-800">{s.lastSeen || 'Yesterday'}</strong></div>
                </div>
              </div>
              <div className="mt-auto bg-slate-50 border-t border-gray-100 p-3 flex items-center gap-2">
                <Btn variant="primary" size="sm" className="flex-1" onClick={() => onOpenDrawer({ type: 'suspect', data: s })}>Open Profile</Btn>
                <Btn variant="secondary" size="sm" className="flex-1">Timeline</Btn>
                <Btn variant="secondary" size="sm" className="flex-1">Connections</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Victims Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck size={16} className="text-emerald-500" />
          <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">
            Complainants & Victims
          </h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {fir.victims?.map(v => (
            <div key={v.id} className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col overflow-hidden hover:border-emerald-200 transition-colors">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
                  <h4 className="text-[15px] font-extrabold text-slate-900 leading-tight">{v.name}</h4>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{v.contact || 'Contact Hidden'}</span>
                </div>
                
                <p className="text-[13px] text-slate-600 italic font-medium leading-relaxed mb-4">"{v.statement}"</p>

                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                    <HeartPulse size={12} className="text-rose-500" /> Medical: {v.medical || 'Stable'}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                    <FileCheck2 size={12} className="text-blue-500" /> Evidence Linked
                  </span>
                </div>
              </div>
              <div className="mt-auto bg-slate-50 border-t border-gray-100 p-3 flex items-center gap-2">
                <Btn variant="secondary" size="sm" className="flex-1" onClick={() => onOpenDrawer({ type: 'victim', data: v })}>View Details</Btn>
                <Btn variant="secondary" size="sm" className="flex-1">Compensation</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
