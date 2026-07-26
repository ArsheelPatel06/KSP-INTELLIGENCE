import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovernmentHeader } from './GovernmentHeader';
import { IntelligenceSidebar } from './IntelligenceSidebar';
import { GlobalFooter } from './GlobalFooter';

// AppLayout uses CSS custom properties from index.css — no isDarkMode needed here
// The <html data-theme> attribute set in AppContext drives all colours via var(--t-*)
export function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--t-bg-root)', transition: 'background-color 0.25s ease' }}>
      <GovernmentHeader />
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sticky sidebar */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
          <IntelligenceSidebar />
        </div>
        {/* Main content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--t-bg-root)', transition: 'background-color 0.25s ease' }}>
          <div style={{ padding: '1.25rem', flex: 1 }}>
            <Outlet />
          </div>
        </main>
      </div>
      <GlobalFooter />
    </div>
  );
}
