import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const base = "inline-flex items-center font-medium rounded-full border px-2.5 py-0.5 text-xs transition-colors";
  
  const variants = {
    default: "bg-slate-800/80 text-slate-300 border-slate-700",
    primary: "bg-blue-950/80 text-blue-400 border-blue-800/60",
    success: "bg-emerald-950/80 text-emerald-400 border-emerald-800/60",
    warning: "bg-amber-950/80 text-amber-400 border-amber-800/60",
    danger: "bg-rose-950/80 text-rose-400 border-rose-800/60",
    cyan: "bg-cyan-950/80 text-cyan-400 border-cyan-800/60",
    purple: "bg-purple-950/80 text-purple-400 border-purple-800/60"
  };

  const sizes = {
    sm: "px-2 py-0.2 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
