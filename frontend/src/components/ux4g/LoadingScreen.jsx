import React, { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [step, setStep] = useState(0);

  const messages = [
    "Loading Secure Intelligence Platform...",
    "Verifying Clearance...",
    "Connecting Intelligence Services...",
    "Loading Investigation Workspace..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="ux4g-flex ux4g-flex-col ux4g-items-center ux4g-justify-center ux4g-h-screen ux4g-w-screen ux4g-bg-neutral-900 ux4g-text-white" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: '#18181B', color: '#FFF' }}>
      <img src="/images/emblem-w.png" alt="KSP Logo" className="ux4g-mb-xl ux4g-h-24 ux4g-opacity-90" style={{ height: '6rem', marginBottom: '2rem', filter: 'invert(1)', opacity: 0.9 }} />
      <h1 className="ux4g-text-xl ux4g-font-bold ux4g-tracking-widest ux4g-mb-m" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>KSP Intelligence OS</h1>
      <div className="ux4g-w-64 ux4g-h-1 ux4g-bg-neutral-800 ux4g-rounded-full ux4g-overflow-hidden ux4g-mb-l" style={{ width: '16rem', height: '4px', backgroundColor: '#27272A', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div 
          className="ux4g-h-full ux4g-bg-primary-500 ux4g-transition-all" 
          style={{ height: '100%', backgroundColor: '#3B82F6', width: `${((step + 1) / messages.length) * 100}%`, transition: 'width 1.2s ease-in-out' }}
        />
      </div>
      <p className="ux4g-text-sm ux4g-text-neutral-400 ux4g-animate-pulse" style={{ fontSize: '0.875rem', color: '#A1A1AA', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        {messages[step]}
      </p>
    </div>
  );
}
