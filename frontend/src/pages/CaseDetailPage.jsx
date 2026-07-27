import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronRight } from 'lucide-react';

import { CaseHero } from '../components/case-workspace/CaseHero';
import { CaseActionBar } from '../components/case-workspace/CaseActionBar';
import { GlobalRightDrawer } from '../components/case-workspace/GlobalRightDrawer';

import { TimelineTab } from '../components/case-workspace/tabs/TimelineTab';
import { SuspectsVictimsTab } from '../components/case-workspace/tabs/SuspectsVictimsTab';
import { OfficersTab } from '../components/case-workspace/tabs/OfficersTab';
import { EvidenceTab } from '../components/case-workspace/tabs/EvidenceTab';
import { NotesTab } from '../components/case-workspace/tabs/NotesTab';
import { AiSummaryTab } from '../components/case-workspace/tabs/AiSummaryTab';
import { NetworkTab } from '../components/case-workspace/tabs/NetworkTab';
import { CourtLegalTab } from '../components/case-workspace/tabs/CourtLegalTab';
import { AnalyticsTab } from '../components/case-workspace/tabs/AnalyticsTab';

export const CaseDetailPage = () => {
  const { id } = useParams();
  const { firs, addFirNote, updateFirStatus } = useApp();
  const navigate = useNavigate();

  const caseId = id || 'FIR-2026-KA-0042';
  const fir = firs.find(f => f.id === caseId || f.firNumber === caseId) || firs[0];

  const [activeTab, setActiveTab] = useState('ai');
  const [newNoteText, setNewNoteText] = useState('');
  const [drawerEntity, setDrawerEntity] = useState(null); // { type, data }

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setDrawerEntity(null);
          document.activeElement.blur();
        }
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case '/':
          e.preventDefault();
          // Ideally focus a global search, for now just alert or switch tab
          break;
        case 'n':
          e.preventDefault();
          setActiveTab('notes');
          setTimeout(() => document.querySelector('textarea')?.focus(), 100);
          break;
        case 'e':
          e.preventDefault();
          setActiveTab('evidence');
          break;
        case 'g':
          e.preventDefault();
          setActiveTab('network');
          break;
        case 'a':
          e.preventDefault();
          setActiveTab('ai');
          break;
        case 'escape':
          e.preventDefault();
          setDrawerEntity(null);
          break;
        default:
          if (e.ctrlKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            window.print();
          }
          if (e.ctrlKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            alert('Generating Report...');
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddNoteSubmit = (e) => {
    e?.preventDefault();
    if (newNoteText.trim()) { 
      addFirNote(fir.id, newNoteText); 
      setNewNoteText(''); 
    }
  };

  const handleOpenDrawer = (entity) => {
    setDrawerEntity(entity);
  };

  if (!fir) return <div className="p-10 text-center text-slate-500">Case not found.</div>;

  return (
    <div className="flex flex-col gap-6 pb-20 animate-fade-in relative min-h-screen">
      
      {/* ── BREADCRUMBS ── */}
      <div className="flex items-center gap-2 text-[12px] font-bold">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-600 transition-colors">Mission Control</button>
        <ChevronRight size={14} className="text-slate-300" />
        <button onClick={() => navigate('/cases')} className="text-slate-400 hover:text-slate-600 transition-colors">Investigations</button>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-slate-800">{fir.firNumber}</span>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-6">
        <div className="shrink-0">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Investigation Progress</div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[92%]" />
            </div>
            <span className="text-[16px] font-extrabold text-slate-900">92%</span>
          </div>
        </div>
        <div className="flex-1 flex flex-wrap items-center gap-4 text-[12px] font-bold">
          <div className="flex flex-col"><span className="text-emerald-600">FIR</span><span className="text-slate-400 text-[10px] uppercase">Done</span></div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="flex flex-col"><span className="text-emerald-600">Evidence</span><span className="text-slate-400 text-[10px] uppercase">Done</span></div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="flex flex-col"><span className="text-amber-600">Witness</span><span className="text-slate-400 text-[10px] uppercase">2 Pending</span></div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="flex flex-col"><span className="text-blue-600">Forensics</span><span className="text-slate-400 text-[10px] uppercase">Running</span></div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="flex flex-col"><span className="text-slate-500">Chargesheet</span><span className="text-slate-400 text-[10px] uppercase">Pending</span></div>
        </div>
      </div>

      {/* ── CASE HERO ── */}
      <CaseHero fir={fir} updateFirStatus={updateFirStatus} />

      {/* ── PERSISTENT ACTION BAR (TABS) ── */}
      <CaseActionBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── DYNAMIC TAB CONTENT ── */}
      <div className="min-h-[500px]">
        {activeTab === 'ai' && <AiSummaryTab fir={fir} />}
        {activeTab === 'timeline' && <TimelineTab fir={fir} onOpenDrawer={handleOpenDrawer} />}
        {activeTab === 'suspects' && <SuspectsVictimsTab fir={fir} onOpenDrawer={handleOpenDrawer} />}
        {activeTab === 'officers' && <OfficersTab fir={fir} onOpenDrawer={handleOpenDrawer} />}
        {activeTab === 'evidence' && <EvidenceTab fir={fir} onOpenDrawer={handleOpenDrawer} />}
        {activeTab === 'notes' && (
          <NotesTab 
            fir={fir} 
            newNoteText={newNoteText} 
            setNewNoteText={setNewNoteText} 
            handleAddNoteSubmit={handleAddNoteSubmit} 
          />
        )}
        {activeTab === 'network' && <NetworkTab fir={fir} onOpenDrawer={handleOpenDrawer} />}
        {activeTab === 'court' && <CourtLegalTab fir={fir} />}
        {activeTab === 'analytics' && <AnalyticsTab fir={fir} />}
      </div>

      {/* ── GLOBAL RIGHT DRAWER ── */}
      <GlobalRightDrawer entity={drawerEntity} onClose={() => setDrawerEntity(null)} />

    </div>
  );
};
