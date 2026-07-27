import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { DailyBriefDrawer } from './DailyBriefDrawer';

export const HeroSection = () => {
  const { isDarkMode } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setDrawerOpen(true)}
        className="animate-fade-in group relative overflow-hidden rounded-[16px] px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
        style={{ 
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', // Using Tailwind's blue-800 to blue-900 equivalent manually or classes
          boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)'
        }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(30, 58, 138, 0.5)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(30, 58, 138, 0.4)'}
      >
        
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-1/2 -left-[10%] w-[60%] h-[200%] bg-[radial-gradient(circle,#60A5FA_0%,transparent_70%)] -rotate-[15deg]"></div>
          <div className="absolute -bottom-1/2 -right-[10%] w-[60%] h-[200%] bg-[radial-gradient(circle,#3B82F6_0%,transparent_70%)] rotate-[15deg]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={32} className="text-blue-100" />
          </div>
          <div>
            <div className="text-[12px] font-extrabold text-blue-300 uppercase tracking-widest mb-1">
              Sentinel AI • Daily Briefing
            </div>
            <h1 className="text-[28px] font-extrabold m-0 tracking-tight flex items-center gap-3 text-white">
              Good Afternoon, DCP V. Rathore.
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[13px] bg-white/10 px-3 py-1 rounded-full font-bold text-white">District Intelligence Unit</span>
              <span className="text-[13px] font-medium text-blue-300">Last updated just now</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-6 mt-6 md:mt-0">
          <div className="flex flex-col gap-2">
            <div className="text-[12px] font-extrabold text-blue-300 uppercase tracking-widest text-right">Today's Intelligence</div>
            <div className="flex flex-col gap-1 items-end">
              <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> 2 High Risk Crime Clusters
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 1 Crime Spike Predicted
              </div>
            </div>
          </div>
          
          <div className="pl-6 border-l border-white/10">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 border border-amber-500/40 rounded-[10px] cursor-pointer hover:bg-amber-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-glow" />
              <span className="text-[14px] font-extrabold text-amber-300 tracking-wide">THREAT: ELEVATED</span>
              <ChevronRight size={18} className="text-amber-300" />
            </div>
          </div>
        </div>

      </div>

      <DailyBriefDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
