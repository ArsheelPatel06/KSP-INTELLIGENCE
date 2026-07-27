import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, Moon, Sun, Clock, FileText, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function GovernmentHeader() {
  const { isDarkMode, toggleDarkMode, sidebarCollapsed, setSidebarCollapsed, notifications, currentUser, markNotificationRead } = useApp();
  const navigate = useNavigate();

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchDropdown(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotificationDropdown(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <header style={{ backgroundColor: 'var(--t-bg-card)', borderBottom: '1px solid var(--t-border)', flexShrink: 0, transition: 'background-color 0.25s ease, border-color 0.25s ease' }}>

      {/* Top Gov Bar — always stays navy blue */}
      <div style={{ backgroundColor: '#1E3A8A', fontSize: '0.75rem', padding: '0.3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/images/in-flag.png" alt="Indian Flag" style={{ height: '1rem' }} />
          <span style={{ fontWeight: 700 }}>Government of Karnataka</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Skip to Main Content</span>
          <span style={{ opacity: 0.4 }}>|</span>
          {['A-', 'A', 'A+'].map(a => <span key={a} style={{ cursor: 'pointer', opacity: 0.8 }}>{a}</span>)}
          <span style={{ opacity: 0.4 }}>|</span>
          <select style={{ background: 'transparent', border: 'none', color: '#FFF', outline: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>
            <option style={{ color: '#000' }}>English</option>
            <option style={{ color: '#000' }}>ಕನ್ನಡ</option>
          </select>
          <span style={{ opacity: 0.4 }}>|</span>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.125rem' }}
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Main Header bar */}
      <div style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

        {/* Left: Menu + Karnataka Seal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-text-secondary)', padding: '0.375rem' }}
          >
            <Menu size={22} />
          </button>
          <img src="/images/Seal_of_Karnataka.png" alt="Seal of Karnataka" style={{ height: '46px' }} />
        </div>

        {/* Center: Global Search */}
        <div style={{ flex: 1, maxWidth: '42rem', margin: '0 1.5rem', position: 'relative' }} ref={searchRef}>
          <div style={{ position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t-text-muted)' }} />
            <input
              type="button"
              value="Search FIRs, Persons, Vehicles, Evidence or Ask AI… (Ctrl+K)"
              onClick={handleSearchClick}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.5rem 1rem 0.5rem 2.5rem',
                backgroundColor: 'var(--t-bg-input)',
                border: '1px solid var(--t-border)',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                color: 'var(--t-text-muted)',
                outline: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
              onMouseOver={e => e.target.style.borderColor = '#3B82F6'}
              onMouseOut={e => e.target.style.borderColor = 'var(--t-border)'}
            />
          </div>
        </div>

        {/* Right: Emblem + Bells + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 }}>
          <img src="/images/DBIM_Emblem_PNG.png" alt="State Emblem" style={{ height: '46px', filter: isDarkMode ? 'invert(1) brightness(2)' : 'none' }} />
          <div style={{ width: '1px', height: '2rem', backgroundColor: 'var(--t-border)', margin: '0 0.5rem' }} />
          
          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem', color: 'var(--t-text-secondary)', position: 'relative' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }} />
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div style={{
                position: 'absolute', top: '100%', right: '-3rem', marginTop: '1rem', width: '320px',
                backgroundColor: 'var(--t-bg-card)', border: '1px solid var(--t-border)',
                borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 50, overflow: 'hidden'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--t-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--t-bg-card-alt)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--t-text-primary)' }}>Official Notifications</span>
                  {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: '#FFF', backgroundColor: '#1E3A8A', padding: '0.125rem 0.375rem', borderRadius: '1rem' }}>{unreadCount} New</span>}
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.slice(0, 3).map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => { markNotificationRead(notif.id); navigate('/notifications'); setShowNotificationDropdown(false); }}
                      style={{ 
                        padding: '1rem', borderBottom: '1px solid var(--t-border)', cursor: 'pointer',
                        backgroundColor: notif.read ? 'transparent' : 'var(--t-bg-card-alt)',
                        display: 'flex', gap: '0.75rem'
                      }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--t-bg-input)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : 'var(--t-bg-card-alt)'}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: notif.read ? 'transparent' : '#3B82F6', marginTop: '0.375rem', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: notif.read ? 400 : 600, color: 'var(--t-text-primary)', marginBottom: '0.25rem' }}>{notif.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--t-text-muted)' }}>{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  onClick={() => { navigate('/notifications'); setShowNotificationDropdown(false); }}
                  style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 600, color: '#1E3A8A', cursor: 'pointer', borderTop: '1px solid var(--t-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--t-bg-card-alt)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  View All Intelligence <ChevronRight size={14} />
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <div 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, cursor: 'pointer' }}
            >
              AP
            </div>
            
            {showProfileDropdown && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '1rem', width: '240px',
                backgroundColor: 'var(--t-bg-card)', border: '1px solid var(--t-border)',
                borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 50, overflow: 'hidden'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--t-border)', backgroundColor: '#1E3A8A', color: '#FFF' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{currentUser.badge}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{currentUser.district}</div>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  <div onClick={() => { navigate('/settings'); setShowProfileDropdown(false); }} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--t-text-primary)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--t-bg-card-alt)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <Settings size={16} color="var(--t-text-secondary)" /> System Settings
                  </div>
                  <div onClick={() => { navigate('/'); setShowProfileDropdown(false); }} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#EF4444' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--t-bg-card-alt)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <LogOut size={16} /> Secure Sign Out
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
