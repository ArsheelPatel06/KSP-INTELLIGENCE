import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserX, UserCheck, Car, PhoneCall, CreditCard, FileText, MapPin } from 'lucide-react';

const categoryConfig = {
  suspect: { icon: UserX, bg: 'bg-rose-950/90', border: 'border-rose-600', text: 'text-rose-400', headerBg: 'bg-rose-900/60' },
  victim: { icon: UserCheck, bg: 'bg-emerald-950/90', border: 'border-emerald-600', text: 'text-emerald-400', headerBg: 'bg-emerald-900/60' },
  vehicle: { icon: Car, bg: 'bg-amber-950/90', border: 'border-amber-600', text: 'text-amber-400', headerBg: 'bg-amber-900/60' },
  phone: { icon: PhoneCall, bg: 'bg-cyan-950/90', border: 'border-cyan-600', text: 'text-cyan-400', headerBg: 'bg-cyan-900/60' },
  bank: { icon: CreditCard, bg: 'bg-purple-950/90', border: 'border-purple-600', text: 'text-purple-400', headerBg: 'bg-purple-900/60' },
  case: { icon: FileText, bg: 'bg-blue-950/90', border: 'border-blue-600', text: 'text-blue-400', headerBg: 'bg-blue-900/60' },
  location: { icon: MapPin, bg: 'bg-slate-900/90', border: 'border-slate-600', text: 'text-slate-300', headerBg: 'bg-slate-800/60' }
};

export const CustomEntityNode = memo(({ data, selected }) => {
  const config = categoryConfig[data.category] || categoryConfig.case;
  const Icon = config.icon;

  return (
    <div
      className={`min-w-[180px] rounded-lg border shadow-xl backdrop-blur-md transition-all ${
        config.bg
      } ${selected ? 'border-blue-400 ring-2 ring-blue-500/50 shadow-blue-950/50' : config.border}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-2.5 !h-2.5" />

      {/* Header */}
      <div className={`px-3 py-1.5 rounded-t-md flex items-center justify-between border-b border-slate-800/60 ${config.headerBg}`}>
        <div className="flex items-center space-x-1.5">
          <Icon size={14} className={config.text} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.text}`}>
            {data.category}
          </span>
        </div>
        {data.status && (
          <span className="text-[9px] font-semibold text-slate-300 px-1.5 py-0.2 rounded bg-slate-900/80">
            {data.status}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5">
        <p className="text-xs font-bold text-slate-100 truncate">{data.label}</p>
        {data.subLabel && (
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{data.subLabel}</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-2.5 !h-2.5" />
    </div>
  );
});
