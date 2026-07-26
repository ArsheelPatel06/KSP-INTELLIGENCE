import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

export const NodeInspector = ({ selectedNode, onClose, onOpenCase }) => {
  if (!selectedNode) return null;

  const { data } = selectedNode;
  const details = data.details || {};

  return (
    <div className="w-80 bg-[#0A0A0A] border-l border-[#27272A] p-4 h-full flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Entity Inspector</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Category</span>
            <div className="mt-1 flex items-center justify-between">
              <Badge variant="primary" size="md">
                {data.category.toUpperCase()}
              </Badge>
              {data.status && <span className="text-xs text-white font-semibold">{data.status}</span>}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Entity Name / Identifier</span>
            <p className="text-sm font-extrabold text-white mt-0.5">{data.label}</p>
            {data.subLabel && <p className="text-xs text-zinc-400">{data.subLabel}</p>}
          </div>

          <div className="p-3 bg-[#000000] border border-[#27272A] rounded-lg space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block border-b border-[#27272A] pb-1">
              Metadata Properties
            </span>
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-white font-semibold truncate max-w-[140px]">{String(value)}</span>
              </div>
            ))}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
              Intelligence Actions
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => onOpenCase && onOpenCase('FIR-2026-KA-0042')}
                className="w-full text-left px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/50 text-blue-400 text-xs font-bold hover:bg-blue-600/30 transition-all flex items-center justify-between"
              >
                <span>Jump to Linked FIR</span>
                <FileText size={14} />
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-bold hover:bg-zinc-800 transition-all"
                onClick={() => alert(`Initiating surveillance intercept request for ${data.label}`)}
              >
                Request Intercept / Wiretap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#27272A] text-[10px] text-zinc-500 text-center">
        SENTINEL LINK GRAPH ENGINE v2.4-BLACK
      </div>
    </div>
  );
};
