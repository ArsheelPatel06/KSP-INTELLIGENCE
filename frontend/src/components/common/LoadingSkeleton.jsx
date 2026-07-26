import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = "h-20" }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`w-full bg-slate-800/50 rounded-xl border border-slate-800 ${height}`}></div>
      ))}
    </div>
  );
};
