import React from 'react';
import { useInvestigation } from './InvestigationState';
import { Target, FileText, Users, Car, Clock, ShieldAlert } from 'lucide-react';

export const AiInvestigationDock = () => {
  const { 
    currentContext, 
    evidenceCount, 
    peopleCount, 
    vehiclesCount, 
    timelineUpdated, 
    confidence 
  } = useInvestigation();

  if (!currentContext) return null;

  return (
    <div className="w-full p-5 border-b shadow-sm z-20 bg-white dark:bg-[#1c1f26] flex flex-col gap-4 rounded-t-2xl" style={{ borderColor: 'var(--t-border)' }}>
      {/* Top Row: Case & Officer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Current Investigation</span>
          <div className="flex items-center gap-2 mt-0.5">
            <Target size={14} className="text-blue-500" />
            <span className="font-extrabold text-[13px] tracking-wide">{currentContext.id}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Officer</span>
          <span className="font-bold text-[13px] mt-0.5">{currentContext.officer}</span>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] dark:bg-white/5 border" style={{ borderColor: 'var(--t-border)' }}>
          <div className="flex items-center gap-2 text-[11px] font-bold opacity-60">
            <FileText size={12} /> Evidence
          </div>
          <span className="font-bold text-[13px]">{evidenceCount}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] dark:bg-white/5 border" style={{ borderColor: 'var(--t-border)' }}>
          <div className="flex items-center gap-2 text-[11px] font-bold opacity-60">
            <Users size={12} /> People
          </div>
          <span className="font-bold text-[13px]">{peopleCount}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] dark:bg-white/5 border" style={{ borderColor: 'var(--t-border)' }}>
          <div className="flex items-center gap-2 text-[11px] font-bold opacity-60">
            <Car size={12} /> Vehicles
          </div>
          <span className="font-bold text-[13px]">{vehiclesCount}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] dark:bg-white/5 border" style={{ borderColor: 'var(--t-border)' }}>
          <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 dark:text-green-500">
            <ShieldAlert size={12} /> Confidence
          </div>
          <span className="font-black text-[13px] text-green-600 dark:text-green-500">{confidence}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 text-[11px]">
         <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest opacity-50">
            <Clock size={12} /> Timeline Updated
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400">{timelineUpdated}</span>
      </div>
    </div>
  );
};
