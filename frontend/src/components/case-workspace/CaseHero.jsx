import React from 'react';
import { 
  MapPin, Shield, User, FileCheck2, UserX, UserCheck, 
  Sparkles, Clock, Network, FileText, Download, MoreHorizontal, CheckCircle2
} from 'lucide-react';
import { Btn, StatusSelect } from '../common/ButtonSystem';

export const CaseHero = ({ fir, updateFirStatus }) => {
  if (!fir) return null;

  return (
    <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 relative z-10">
        
        {/* Left Side: Identity */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">{fir.firNumber}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-extrabold ${
              fir.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' :
              fir.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200' :
              fir.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                fir.priority === 'Critical' ? 'bg-red-500' :
                fir.priority === 'High' ? 'bg-orange-500' :
                fir.priority === 'Medium' ? 'bg-yellow-400' : 'bg-slate-300'
              }`} />
              {fir.priority} Priority
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-bold bg-blue-50 text-blue-700 border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {fir.status}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-600">
            <span>{fir.crimeType}</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1"><MapPin size={14} className="text-blue-500" /> {fir.district}</span>
          </div>

          <div className="flex items-center gap-4 text-[13px] font-bold mt-2 pt-2 border-t border-gray-100 flex-wrap">
            <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              <Sparkles size={14} /> AI Risk {fir.confidenceScore}%
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <User size={14} className="text-slate-400" /> Officers {fir.officers?.length || 4}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <FileCheck2 size={14} className="text-slate-400" /> Evidence {fir.evidence?.length || 27}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <UserX size={14} className="text-slate-400" /> Suspects {fir.suspects?.length || 3}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <UserCheck size={14} className="text-slate-400" /> Victims {fir.victims?.length || 2}
            </span>
          </div>
        </div>

        {/* Right Side: Primary Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Btn variant="ai" size="lg" icon={Sparkles}>Analyze with AI</Btn>
          <Btn variant="primary" size="lg" icon={FileText}>Generate Report</Btn>
          <Btn variant="secondary" size="lg" icon={User}>Assign Officer</Btn>
          <Btn variant="ghost" size="lg">Share</Btn>
          <Btn variant="ghost" size="lg" icon={MoreHorizontal} />
        </div>
      </div>
      
    </div>
  );
};
