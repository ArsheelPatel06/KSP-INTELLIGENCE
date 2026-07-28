import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GovernmentHeader } from './GovernmentHeader';
import { IntelligenceSidebar } from './IntelligenceSidebar';
import { CommandPalette } from '../components/CommandPalette';
import { useApp } from '../context/AppContext';

// AppLayout uses CSS custom properties from index.css — no isDarkMode needed here
// The <html data-theme> attribute set in AppContext drives all colours via var(--t-*)
export function AppLayout() {
  const location = useLocation();
  const [showCopilot, setShowCopilot] = useState(false);
  const { sidebarCollapsed } = useApp();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--t-bg-root)' }}>
      <CommandPalette />

      {/* Fixed-height header */}
      <div style={{ flexShrink: 0 }}>
        <GovernmentHeader />
      </div>

      {/* Sidebar + Main: fills all remaining vertical space */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Sidebar — scrolls internally */}
        {!sidebarCollapsed && (
          <div style={{ flexShrink: 0, height: '100%', overflowY: 'auto' }}>
            <IntelligenceSidebar />
          </div>
        )}

        {/* Main content — scrolls internally */}
        <main style={{
          flex: 1,
          minWidth: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: 'var(--t-bg-root)',
          transition: 'background-color 0.25s ease',
        }}>
          <div
            key={location.pathname}
            className="animate-fade-in"
            style={{ padding: '1.25rem', minHeight: '100%', animationDuration: '0.25s' }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );

}
