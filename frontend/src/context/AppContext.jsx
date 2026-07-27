import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFirs } from '../mockData/mockFirs';
import { mockNotifications as initialNotifications } from '../mockData/mockNotifications';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState({
    name: 'DCP Vikram Rathore, IPS',
    role: 'Admin', // Investigator, Analyst, Supervisor, Admin
    badge: 'IPS-KA-2016-89',
    district: 'State HQ Bengaluru'
  });

  const [firs, setFirs] = useState(mockFirs);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiLanguage, setAiLanguage] = useState('en'); // 'en' or 'kn'
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Global Copilot Chat History
  const [copilotMessages, setCopilotMessages] = useState([
    { id: 1, sender: 'bot', text: 'Good afternoon, DCP V. Rathore. I have prepared your daily briefing. There is a cluster of 7 Cyber Fraud FIRs in Indiranagar that requires your attention.' },
    { id: 2, sender: 'bot', text: 'Would you like me to open the full investigation workspace for this cluster?', action: 'open_workspace' }
  ]);
  const [chatSessionId, setChatSessionId] = useState(null);

  // Sync theme to <html data-theme> so CSS variables & global overrides fire
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Mark single notification as read
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Mark all notifications read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Add new FIR note
  const addFirNote = (firId, noteText) => {
    setFirs(prev => prev.map(fir => {
      if (fir.id === firId) {
        const newTimelineItem = {
          time: new Date().toLocaleString(),
          title: "Officer Note Added",
          detail: noteText
        };
        return {
          ...fir,
          timeline: [newTimelineItem, ...fir.timeline]
        };
      }
      return fir;
    }));
  };

  // Update FIR status
  const updateFirStatus = (firId, newStatus) => {
    setFirs(prev => prev.map(fir => {
      if (fir.id === firId) {
        return { ...fir, status: newStatus };
      }
      return fir;
    }));
  };

  const value = {
    currentUser,
    setCurrentUser,
    firs,
    setFirs,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    sidebarCollapsed,
    setSidebarCollapsed,
    aiLanguage,
    setAiLanguage,
    addFirNote,
    updateFirStatus,
    isDarkMode,
    toggleDarkMode,
    copilotMessages,
    setCopilotMessages,
    chatSessionId,
    setChatSessionId
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
