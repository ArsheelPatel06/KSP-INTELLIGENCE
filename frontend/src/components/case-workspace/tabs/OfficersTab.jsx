import React from 'react';
import { UserCheck, Shield, MessageSquare, Briefcase, Activity } from 'lucide-react';
import { Btn } from '../../common/ButtonSystem';

const avatarColors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500'];
const getAvatarColor = (n = '') => avatarColors[n.charCodeAt(0) % avatarColors.length];
const getInitials    = (n = '') => n.split(' ').filter(Boolean).slice(0,2).map(c=>c[0]).join('').toUpperCase();

export const OfficersTab = ({ fir, onOpenDrawer }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">Assigned Investigation Officers</h3>
        <Btn variant="primary" size="sm" icon={UserCheck}>Assign New Officer</Btn>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {fir.officers?.map((off, idx) => (
          <div key={off.id} className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col overflow-hidden hover:border-blue-200 transition-colors">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-white text-[16px] font-extrabold shadow-sm ${getAvatarColor(off.name)}`}>
                    {getInitials(off.name)}
                  </div>
                  <div>
                    <h4 className="text-[16px] font-extrabold text-slate-900">{off.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] font-bold text-slate-500">{off.rank}</span>
                      {idx === 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border text-blue-700 bg-blue-50 border-blue-200">
                          <Shield size={10} /> LEAD
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100 text-center">
                  <div className="text-[18px] font-extrabold text-slate-800">{off.openCases || 17}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Open Cases</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100 text-center">
                  <div className="text-[18px] font-extrabold text-blue-600">{off.tasks || 4}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Today's Tasks</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100 text-center">
                  <div className="text-[18px] font-extrabold text-emerald-600">{off.efficiency || '91%'}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Efficiency</div>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-slate-50 border-t border-gray-100 p-3 flex items-center gap-2">
              <Btn variant="secondary" size="sm" className="flex-1" icon={MessageSquare}>Message</Btn>
              <Btn variant="secondary" size="sm" className="flex-1" icon={Briefcase}>Assign Task</Btn>
              <Btn variant="primary" size="sm" className="flex-1" onClick={() => onOpenDrawer({ type: 'officer', data: off })}>Profile</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
