import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  BrainCircuit,
  BarChart3,
  Map as MapIcon,
  Network,
  FileText,
  Bell,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

// Uses CSS custom properties from index.css — no isDarkMode prop needed
export function IntelligenceSidebar() {
  const [investigationsOpen, setInvestigationsOpen] = useState(true);

  const NavItem = ({ to, icon: Icon, label, end }) => (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
        fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
        textDecoration: 'none', marginBottom: '0.125rem',
        backgroundColor: isActive ? 'var(--t-bg-hover)' : 'transparent',
        color: isActive ? 'var(--t-accent)' : 'var(--t-text-secondary)',
        transition: 'background-color 0.15s ease, color 0.15s ease'
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.backgroundColor = 'var(--t-bg-card-alt)';
          e.currentTarget.style.color = 'var(--t-text-primary)';
        }
      }}
      onMouseLeave={e => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--t-text-secondary)';
        }
      }}
    >
      <Icon size={17} />
      <span>{label}</span>
    </NavLink>
  );

  const sectionLabel = {
    fontSize: '0.625rem', fontWeight: 800, color: 'var(--t-text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: '0.375rem', padding: '0 0.75rem'
  };

  return (
    <aside style={{
      width: '15rem', flexShrink: 0,
      backgroundColor: 'var(--t-bg-card)',
      borderRight: '1px solid var(--t-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflowY: 'auto',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>

        {/* Core Operations */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={sectionLabel}>Core Operations</div>
          <NavItem to="/" end icon={LayoutDashboard} label="Mission Control" />
          <NavItem to="/ai-assistant" icon={BrainCircuit} label="AI Copilot" />
        </div>

        {/* Intelligence */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={sectionLabel}>Intelligence</div>

          {/* Investigations collapsible */}
          <button
            onClick={() => setInvestigationsOpen(!investigationsOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', color: 'var(--t-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.125rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={17} />
              <span>Investigations</span>
            </div>
            {investigationsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>

          {investigationsOpen && (
            <div style={{ marginLeft: '1.25rem', marginTop: '0.25rem', borderLeft: '1px solid var(--t-border)', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>
              <NavLink to="/cases" end style={{ display: 'block', padding: '0.25rem 0.5rem', fontSize: '0.8125rem', textDecoration: 'none', borderRadius: '0.25rem', color: 'var(--t-text-secondary)' }}>
                All Cases
              </NavLink>
              <div style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--t-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem', marginTop: '0.25rem' }}>RECENT</div>
              {['FIR-2026-089', 'FIR-2026-092'].map(fir => (
                <NavLink key={fir} to={`/cases/${fir}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.8125rem', textDecoration: 'none', borderRadius: '0.25rem', color: 'var(--t-text-secondary)' }}>
                  <FolderOpen size={12} /> {fir}
                </NavLink>
              ))}
            </div>
          )}

          <NavItem to="/analytics" icon={BarChart3} label="Crime Analytics" />
          <NavItem to="/map" icon={MapIcon} label="Crime Map" />
          <NavItem to="/network" icon={Network} label="Knowledge Graph" />
          <NavItem to="/reports" icon={FileText} label="Reports" />
        </div>
      </div>

      {/* Bottom: Settings */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--t-border)', transition: 'border-color 0.25s ease' }}>
        <NavItem to="/notifications" icon={Bell} label="Notifications" />
        <NavItem to="/admin" icon={Shield} label="Administration" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}
