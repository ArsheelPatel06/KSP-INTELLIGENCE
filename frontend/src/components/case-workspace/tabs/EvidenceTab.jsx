import React from 'react';
import { FileCheck2, Download, Search, FileText, CheckCircle2, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { Btn, BtnIcon } from '../../common/ButtonSystem';

export const EvidenceTab = ({ fir, onOpenDrawer }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">Secured Digital Evidence</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search evidence..." 
              className="pl-8 pr-4 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-[12px] font-medium text-slate-700 w-48 focus:outline-none focus:border-blue-400"
            />
          </div>
          <BtnIcon icon={Filter} variant="secondary" />
          <Btn variant="primary" size="sm" icon={FileCheck2}>Upload Evidence</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fir.evidence?.map((ev, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col overflow-hidden hover:border-blue-200 transition-colors group">
            
            {/* Thumbnail area */}
            <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-gray-100 cursor-pointer" onClick={() => onOpenDrawer({ type: 'evidence', data: ev })}>
              {ev.type === 'video' ? (
                <div className="w-10 h-10 rounded-full bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                </div>
              ) : ev.type === 'image' ? (
                <img src={ev.url || `https://source.unsplash.com/random/400x300?crime,${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <FileText size={32} className="text-slate-400" />
              )}
              
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">{ev.type}</span>
              </div>
            </div>

            {/* Metadata area */}
            <div className="p-4">
              <h4 className="text-[14px] font-extrabold text-slate-900 truncate mb-1" title={ev.file}>{ev.file}</h4>
              <div className="text-[11px] font-mono text-slate-400 mb-3">ID: {ev.id || `EVD-${Math.floor(Math.random()*10000)}`}</div>
              
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Source</span>
                  <span className="font-bold text-slate-800">{ev.source || 'Crime Scene'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Uploaded By</span>
                  <span className="font-bold text-slate-800">{ev.uploader || 'Insp. Raj'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Timestamp</span>
                  <span className="font-bold text-slate-800">{ev.timestamp || '2026-07-27 10:45'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                  <ShieldCheck size={12} /> HASH VERIFIED
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                  <Sparkles size={12} /> AI TAGGED
                </span>
              </div>
            </div>

            <div className="mt-auto bg-slate-50 border-t border-gray-100 p-2 flex items-center gap-1">
              <Btn variant="ghost" size="sm" className="flex-1" onClick={() => onOpenDrawer({ type: 'evidence', data: ev })}>Preview</Btn>
              <Btn variant="ghost" size="sm" className="flex-1">Chain</Btn>
              <Btn variant="ghost" size="sm" className="flex-1">DL</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
