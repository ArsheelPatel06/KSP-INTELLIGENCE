import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';

export const EmptyState = ({ title = "No Intelligence Records Found", description = "Try adjusting your filters or search query to find relevant crime data.", actionLabel, onAction }) => {
  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-10 text-center flex flex-col items-center justify-center">
      <div className="p-4 rounded-full bg-slate-800/60 text-slate-400 mb-3 border border-slate-700/50">
        <Database size={32} />
      </div>
      <h3 className="text-sm font-bold text-slate-200">{title}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ title = "System Communication Error", message = "Unable to fetch intelligence feeds. Please check network connection or security authorization.", onRetry }) => {
  return (
    <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-8 text-center flex flex-col items-center justify-center">
      <div className="p-3 rounded-full bg-rose-950 text-rose-400 mb-3 border border-rose-800">
        <AlertTriangle size={28} />
      </div>
      <h3 className="text-sm font-bold text-rose-200">{title}</h3>
      <p className="mt-1 text-xs text-rose-300/80 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};
