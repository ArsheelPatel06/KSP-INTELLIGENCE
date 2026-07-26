import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '../../context/AppContext';

export const MainLayout = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#000000] text-white flex">
      <Sidebar />
      <Navbar />
      <main
        className={`flex-1 pt-20 pb-10 px-6 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};
