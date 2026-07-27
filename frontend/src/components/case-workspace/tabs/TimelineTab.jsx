import React from 'react';
import { Download } from 'lucide-react';
import { Btn } from '../../common/ButtonSystem';

export const TimelineTab = ({ fir, onOpenDrawer }) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">Chronological Event Log</h3>
        <Btn variant="secondary" size="sm" icon={Download}>Export Timeline</Btn>
      </div>

      <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
        {fir.timeline?.map((item, i) => (
          <div key={i} className="relative pl-8 group">
            {/* Timeline dot */}
            <span className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center
              ${item.title.includes('AI') ? 'bg-indigo-500' :
                item.title.includes('Registered') ? 'bg-emerald-500' :
                item.title.includes('Arrested') ? 'bg-rose-500' : 'bg-blue-500'
              }
            `} />
            
            <div className="bg-white border border-gray-100 rounded-[14px] p-5 shadow-sm group-hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
                <span className="text-[15px] font-extrabold text-slate-900">{item.title}</span>
                <span className="text-[12px] text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-md">{item.time}</span>
              </div>
              
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-4">
                {item.detail}
              </p>

              <div className="flex items-center gap-3">
                {/* Meta badges */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-[11px] font-bold text-slate-500 border border-slate-100">
                  Officer Inspector Raj
                </span>
                {item.title.includes('AI') && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-[11px] font-bold text-indigo-700 border border-indigo-100">
                    AI Auto-Analysis
                  </span>
                )}
                {item.title.includes('Evidence') && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-[11px] font-bold text-amber-700 border border-amber-100 cursor-pointer"
                        onClick={() => onOpenDrawer({ type: 'evidence', data: { file: 'CCTV_Footage.mp4', type: 'video' } })}>
                    Photo / Video Attached
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
