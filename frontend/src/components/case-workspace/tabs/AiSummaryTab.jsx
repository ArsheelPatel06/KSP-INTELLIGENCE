import React from 'react';
import { Bot, Network, Target, Brain, FileCheck2, ArrowRight } from 'lucide-react';
import { Btn } from '../../common/ButtonSystem';

export const AiSummaryTab = ({ fir }) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[20px] shadow-lg overflow-hidden border border-indigo-500/20">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30">
              <Bot size={24} className="text-indigo-300" />
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-white tracking-wide">AI Intelligence Summary</h2>
              <p className="text-[13px] text-indigo-200 font-medium mt-0.5">Automated synthesis of FIR data, evidence, and historical patterns.</p>
            </div>
          </div>
          <Btn variant="primary" size="md" className="bg-indigo-500 hover:bg-indigo-400 text-white border-none shadow-indigo-500/20">
            Open Full AI Analysis <ArrowRight size={14} className="ml-1" />
          </Btn>
        </div>

        {/* Intelligence Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 rounded-[16px] p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-indigo-400" />
              <span className="text-[11px] font-extrabold text-indigo-200 uppercase tracking-widest">Pattern Match</span>
            </div>
            <div className="text-[32px] font-extrabold text-white leading-none">{fir.confidenceScore || 89}%</div>
            <p className="text-[12px] text-indigo-200 mt-2">Matches MO of West Syndicate gang robberies.</p>
          </div>

          <div className="bg-white/5 rounded-[16px] p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Network size={16} className="text-emerald-400" />
              <span className="text-[11px] font-extrabold text-emerald-200 uppercase tracking-widest">Similar FIRs</span>
            </div>
            <div className="text-[32px] font-extrabold text-white leading-none">6</div>
            <p className="text-[12px] text-emerald-200 mt-2">Correlated cases in the last 90 days in this district.</p>
          </div>

          <div className="bg-white/5 rounded-[16px] p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-rose-400" />
              <span className="text-[11px] font-extrabold text-rose-200 uppercase tracking-widest">Predicted Mastermind</span>
            </div>
            <div className="text-[20px] font-extrabold text-white leading-none mt-1">Ramesh Shetty</div>
            <p className="text-[12px] text-rose-200 mt-2">Alias: Snake (High probability match).</p>
          </div>

          <div className="bg-white/5 rounded-[16px] p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 size={16} className="text-amber-400" />
              <span className="text-[11px] font-extrabold text-amber-200 uppercase tracking-widest">Likely Motive</span>
            </div>
            <div className="text-[20px] font-extrabold text-white leading-none mt-1">Financial</div>
            <p className="text-[12px] text-amber-200 mt-2">Organized debt recovery escalation.</p>
          </div>
        </div>

        {/* Next Recommendation */}
        <div className="px-8 pb-8">
          <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-[16px] p-6">
            <div className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest mb-2">Next Recommended Action</div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[16px] font-bold text-white">Interview Witness #3 regarding the getaway vehicle (KA03AB3238).</p>
              <Btn variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20 shrink-0">Execute Recommendation</Btn>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
