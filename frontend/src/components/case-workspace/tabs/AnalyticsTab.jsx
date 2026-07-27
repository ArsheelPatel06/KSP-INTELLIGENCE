import React from 'react';
import { BarChart3, TrendingUp, Activity, Crosshair } from 'lucide-react';

export const AnalyticsTab = ({ fir }) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">Case Analytics & Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col items-center justify-center text-center">
          <Activity size={24} className="text-blue-500 mb-2" />
          <div className="text-[28px] font-extrabold text-slate-900 leading-none mb-1">92%</div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Completion</div>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col items-center justify-center text-center">
          <TrendingUp size={24} className="text-emerald-500 mb-2" />
          <div className="text-[28px] font-extrabold text-slate-900 leading-none mb-1">High</div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Conviction Prob</div>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col items-center justify-center text-center">
          <Crosshair size={24} className="text-rose-500 mb-2" />
          <div className="text-[28px] font-extrabold text-slate-900 leading-none mb-1">2</div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Target Suspects</div>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col items-center justify-center text-center">
          <BarChart3 size={24} className="text-indigo-500 mb-2" />
          <div className="text-[28px] font-extrabold text-slate-900 leading-none mb-1">14</div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Days Active</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex items-center justify-center h-64 text-slate-400 text-[13px] font-medium border-dashed">
        Detailed case trajectory and heatmap visualization will render here.
      </div>
    </div>
  );
};
