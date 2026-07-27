import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, FolderOpen, User, Car, Hash, Link as LinkIcon, Command, X } from 'lucide-react';

export const CommandPalette = () => {
  const { isDarkMode } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const handleCustomEvent = () => setIsOpen(true);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomEvent);
    };
  }, []);

  if (!isOpen) return null;

  const categories = [
    { title: 'Cases', icon: FolderOpen, results: ['FIR-2024-089 (Cyber)', 'FIR-2024-091 (Theft)'] },
    { title: 'People', icon: User, results: ['Suspect: Ramesh Kumar', 'Victim: S. Sharma'] },
    { title: 'Vehicles', icon: Car, results: ['KA-01-EG-1234 (Flagged)', 'MH-12-AB-9876'] },
    { title: 'Commands', icon: Command, results: ['Navigate to Analytics', 'Open AI Assistant'] }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={() => setIsOpen(false)} className="animate-fade-in" />
      
      <div className="animate-scale-in" style={{ position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: isDarkMode ? '#0B1120' : '#FFFFFF', border: `1px solid ${border}`, borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: `1px solid ${border}` }}>
          <Search size={20} style={{ color: textSecondary, marginRight: '0.75rem' }} />
          <input 
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cases, people, vehicles, or type a command..." 
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: textPrimary, fontSize: '1rem', outline: 'none' }} 
          />
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.625rem', padding: '0.25rem 0.375rem', borderRadius: '0.25rem', backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', color: textSecondary, border: `1px solid ${border}` }}>ESC</span>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <cat.icon size={12} /> {cat.title}
              </div>
              {cat.results.map((res, j) => (
                <div key={j} style={{ padding: '0.75rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: textPrimary, fontSize: '0.875rem' }} className="t-card-alt-hover hover-bg">
                  {res}
                  <ArrowRight size={14} style={{ color: textSecondary, opacity: 0 }} className="show-on-hover" />
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background-color: var(--t-bg-hover); }
        .hover-bg:hover .show-on-hover { opacity: 1 !important; }
      `}} />
    </div>
  );
};

const ArrowRight = ({ size, style, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);
