import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, trend = 'up', icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: { iconBg: 'bg-blue-950/90 text-blue-400 border-blue-800/60', text: 'text-blue-400' },
    rose: { iconBg: 'bg-rose-950/90 text-rose-400 border-rose-800/60', text: 'text-rose-400' },
    emerald: { iconBg: 'bg-emerald-950/90 text-emerald-400 border-emerald-800/60', text: 'text-emerald-400' },
    amber: { iconBg: 'bg-amber-950/90 text-amber-400 border-amber-800/60', text: 'text-amber-400' },
    cyan: { iconBg: 'bg-cyan-950/90 text-cyan-400 border-cyan-800/60', text: 'text-cyan-400' }
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-5 hover:border-zinc-700 transition-all shadow-xl hover:shadow-blue-950/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${selectedColor.iconBg}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
        {change && (
          <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-zinc-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
