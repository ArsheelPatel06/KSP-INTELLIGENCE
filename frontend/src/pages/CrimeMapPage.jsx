import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CrimeMapComponent } from '../components/map/CrimeMapComponent';
import { MapPin } from 'lucide-react';

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
    <div className="flex flex-col gap-5 pb-8 animate-fade-in font-sans h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm shrink-0">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin size={24} className="text-blue-600" />
            Geospatial Crime Hotspots &amp; GIS Map
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Real-time geospatial plotting, heatmaps, and police station boundaries across Karnataka state.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-[8px] bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-extrabold uppercase tracking-widest">
            {filteredFirs.length} Incidents Plotted
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-5 shrink-0">
        <div>
          <label className="block text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Filter District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full h-11 px-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[14px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none cursor-pointer"
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
          <label className="block text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Offense Type
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-11 px-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[14px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Offense Categories</option>
            <option value="Cyber Financial Fraud">Cyber Financial Fraud</option>
            <option value="Chain Snatching">Chain Snatching</option>
            <option value="Armed Robbery">Armed Robbery</option>
            <option value="Homicide Investigation">Homicide Investigation</option>
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Severity Level
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full h-11 px-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[14px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Main Map Component */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[18px] shadow-sm overflow-hidden min-h-[500px]">
        <CrimeMapComponent firs={filteredFirs} selectedDistrict={selectedDistrict} />
      </div>
    </div>
  );
};
