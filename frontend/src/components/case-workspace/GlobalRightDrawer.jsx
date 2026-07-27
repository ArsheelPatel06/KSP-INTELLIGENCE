import React from 'react';
import { X, User, FileText, Activity, ShieldAlert, Sparkles, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { BtnIcon, Btn } from '../common/ButtonSystem';

export const GlobalRightDrawer = ({ entity, onClose }) => {
  if (!entity) return null;

  const { type, data } = entity;

  const renderContent = () => {
    switch (type) {
      case 'suspect':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <User size={28} />}
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-slate-900">{data.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] font-bold text-slate-500">Alias: {data.alias || 'None'}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">HIGH RISK</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</div>
                <div className="text-[13px] font-bold text-slate-800">{data.status || 'In Custody'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Age</div>
                <div className="text-[13px] font-bold text-slate-800">{data.age || 46}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Gang Affiliation</div>
                <div className="text-[13px] font-bold text-slate-800">{data.gang || 'West Syndicate'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Vehicle</div>
                <div className="text-[13px] font-bold text-slate-800">{data.vehicle || 'KA03AB3238'}</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-[14px]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-blue-600" />
                <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-widest">AI Summary</span>
              </div>
              <p className="text-[13px] text-slate-700 font-medium">Suspect frequently operates in {data.lastSeen || 'Indiranagar'}, linked to 3 prior offenses involving armed robbery.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Btn variant="primary" className="w-full">Open Full Profile</Btn>
              <Btn variant="secondary" className="w-full">View Timeline</Btn>
              <Btn variant="secondary" className="w-full">View Connections</Btn>
            </div>
          </div>
        );

      case 'officer':
        return (
          <div className="space-y-6">
             <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[14px] bg-blue-600 flex items-center justify-center text-white overflow-hidden shrink-0 text-[20px] font-bold">
                {data.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-slate-900">{data.name}</h2>
                <div className="text-[12px] font-bold text-slate-500 mt-1">{data.rank}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100 text-center">
                <div className="text-[20px] font-extrabold text-slate-800">{data.openCases || 17}</div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Cases</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100 text-center">
                <div className="text-[20px] font-extrabold text-blue-600">{data.tasks || 4}</div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tasks</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100 text-center">
                <div className="text-[20px] font-extrabold text-emerald-600">{data.efficiency || '91%'}</div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Eff</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Btn variant="primary" className="w-full">Message Officer</Btn>
              <Btn variant="secondary" className="w-full">Assign Task</Btn>
              <Btn variant="secondary" className="w-full">View Profile</Btn>
            </div>
          </div>
        );
        
      case 'evidence':
        return (
          <div className="space-y-6">
            <div className="w-full h-48 bg-slate-900 rounded-[14px] flex items-center justify-center text-white overflow-hidden border border-gray-200 shadow-sm relative">
              {data.type === 'video' ? (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                </div>
              ) : data.type === 'image' ? (
                <img src={data.url || 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2070'} className="w-full h-full object-cover" />
              ) : (
                 <FileText size={48} className="text-slate-600" />
              )}
            </div>

            <div>
              <h2 className="text-[18px] font-extrabold text-slate-900 truncate">{data.file}</h2>
              <div className="text-[12px] text-slate-500 font-medium mt-1">Evidence ID: {data.id || 'EVD-9234'}</div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-[14px] border border-gray-100 text-[12px]">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-slate-500 font-bold">Source</span>
                <span className="font-extrabold text-slate-800">{data.source || 'CCTV Camera 4'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-slate-500 font-bold">Uploaded By</span>
                <span className="font-extrabold text-slate-800">{data.uploader || 'Inspector Raj'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-slate-500 font-bold">Timestamp</span>
                <span className="font-extrabold text-slate-800">{data.timestamp || '2026-07-27 14:32'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-slate-500 font-bold">Hash Verified</span>
                <span className="font-extrabold text-emerald-600">Verified (SHA-256)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">AI Processed</span>
                <span className="font-extrabold text-blue-600">Complete</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Btn variant="primary" className="w-full">Preview Full Size</Btn>
              <Btn variant="secondary" className="w-full">Download File</Btn>
              <Btn variant="secondary" className="w-full">Chain of Custody</Btn>
            </div>
          </div>
        );

      case 'victim':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900">{data.name}</h2>
              <div className="text-[12px] font-bold text-slate-500 mt-1">Victim Profile</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Contact</div>
                <div className="text-[13px] font-bold text-slate-800">{data.contact || 'Hidden'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-[12px] border border-gray-100">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Medical</div>
                <div className="text-[13px] font-bold text-slate-800">{data.medical || 'Stable'}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-gray-100 rounded-[14px]">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Statement</div>
              <p className="text-[13px] text-slate-700 italic font-medium leading-relaxed">
                "{data.statement || 'Pending full interview.'}"
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Btn variant="primary" className="w-full">Full Profile</Btn>
              <Btn variant="secondary" className="w-full">Compensation Status</Btn>
              <Btn variant="secondary" className="w-full">Linked Evidence</Btn>
            </div>
          </div>
        );

      default:
        return <div className="text-[13px] text-slate-500">Details not available.</div>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform border-l border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-slate-50/50">
          <h2 className="text-[13px] font-extrabold text-slate-600 uppercase tracking-widest">
            {type.charAt(0).toUpperCase() + type.slice(1)} Details
          </h2>
          <BtnIcon icon={X} variant="ghost" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </>
  );
};
