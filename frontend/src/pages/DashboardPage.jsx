import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MessageSquare } from 'lucide-react';
import { HeroSection } from '../components/dashboard/HeroSection';
import { KPIGrid } from '../components/dashboard/KPIGrid';
import { IntelligenceCenter } from '../components/dashboard/IntelligenceCenter';
import { ForecastChart } from '../components/dashboard/ForecastChart';
import { InteractiveCrimeMap } from '../components/dashboard/InteractiveCrimeMap';
import { EnterpriseTable } from '../components/dashboard/EnterpriseTable';
import { LiveFeed } from '../components/dashboard/LiveFeed';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { IntelligenceTimeline } from '../components/dashboard/IntelligenceTimeline';

export const DashboardPage = () => {
  const { isDarkMode } = useApp();
  const navigate = useNavigate();

  // Mock data for the Enterprise Table
  const investigationData = [
    { fir: 'FIR-2024-089', officer: 'S. Patil', priority: 'High', score: 94, district: 'Indiranagar', status: 'Active', updated: '10m ago' },
    { fir: 'FIR-2024-091', officer: 'M. Kumar', priority: 'Critical', score: 98, district: 'Koramangala', status: 'Escalated', updated: '2m ago' },
    { fir: 'FIR-2024-077', officer: 'A. Sharma', priority: 'Medium', score: 72, district: 'Jayanagar', status: 'Pending Review', updated: '1h ago' },
    { fir: 'FIR-2024-092', officer: 'R. Singh', priority: 'Low', score: 45, district: 'Whitefield', status: 'Closed', updated: '3h ago' },
  ];

  const tableColumns = [
    { key: 'fir', label: 'FIR Number', width: '15%' },
    { key: 'officer', label: 'Lead Officer', width: '20%' },
    { key: 'district', label: 'District', width: '15%' },
    { key: 'score', label: 'AI Score', width: '10%', render: (val) => <span className={`font-extrabold ${val > 90 ? 'text-red-600' : val > 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{val}</span> },
    { key: 'priority', label: 'Priority', width: '15%', render: (val) => <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase border ${val === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' : val === 'High' ? 'bg-orange-50 border-orange-200 text-orange-700' : val === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{val}</span> },
    { key: 'status', label: 'Status', width: '15%' },
    { key: 'updated', label: 'Last Updated', width: '10%' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fade-in font-sans">
      
      <HeroSection />
      
      <KPIGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-5">
          <InteractiveCrimeMap />
          <ForecastChart />
          <EnterpriseTable 
            title="Recent Investigations" 
            columns={tableColumns} 
            data={investigationData} 
            onRowClick={(row) => navigate(`/cases/${row.fir}`)} 
          />
        </div>

        {/* Right Column (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <IntelligenceCenter />
          <LiveFeed />
          <SystemHealth />
        </div>

      </div>

      <IntelligenceTimeline />
    </div>
  );
};
