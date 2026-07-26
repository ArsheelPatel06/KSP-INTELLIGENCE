import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CrimeMapComponent } from '../components/map/CrimeMapComponent';
import { Badge } from '../components/common/Badge';

export const CrimeMapPage = () => {
  const { firs } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filteredFirs = firs.filter((fir) => {
    if (selectedDistrict !== 'All' && fir.district !== selectedDistrict) return false;
    if (selectedCategory !== 'All' && fir.crimeType !== selectedCategory) return false;
    if (selectedPriority !== 'All' && fir.priority !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl p-5 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white">Geospatial Crime Hotspots & GIS Map</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time geospatial plotting, heatmaps, and police station boundaries across Karnataka state.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="cyan" size="md">
            {filteredFirs.length} Incidents Plotted
          </Badge>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-4 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1">
            Filter District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-[#000000] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="All">All Karnataka Districts (10)</option>
            <option value="Bengaluru Urban">Bengaluru Urban</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
            <option value="Mangaluru">Mangaluru</option>
            <option value="Belagavi">Belagavi</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1">
            Offense Type
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#000000] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="All">All Offense Categories</option>
            <option value="Cyber Financial Fraud">Cyber Financial Fraud</option>
            <option value="Chain Snatching">Chain Snatching</option>
            <option value="Armed Robbery">Armed Robbery</option>
            <option value="Homicide Investigation">Homicide Investigation</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1">
            Severity Level
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full bg-[#000000] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Main Map Component */}
      <CrimeMapComponent firs={filteredFirs} selectedDistrict={selectedDistrict} />
    </div>
  );
};
