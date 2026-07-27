import React from 'react';
import { useInvestigation } from './InvestigationState';
import { LayoutDashboard, FileText, Clock, Users, Car, Network, FileBarChart, ChevronLeft, ChevronRight, User, MapPin, Lightbulb, AlertCircle } from 'lucide-react';

const tabs = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Timeline', icon: Clock },
  { name: 'Evidence', icon: FileText },
  { name: 'People', icon: Users },
  { name: 'Vehicles', icon: Car },
  { name: 'Graph', icon: Network },
  { name: 'Reports', icon: FileBarChart },
];

const getRecommendations = (messages) => {
  const lastAiMsg = [...(messages || [])].reverse().find(m => m.sender === 'ai');
  const type = lastAiMsg?.type;
  if (type === 'timeline') return [
    "Add financial records to this timeline",
    "Check CCTV footage for these times",
    "Export timeline as PDF",
  ];
  if (type === 'graph') return [
    "Identify strongest network node",
    "Expand network by 2 degrees",
    "Export knowledge graph",
  ];
  if (type === 'search_case' || type === 'search_person') return [
    "Generate full investigation report",
    "Find associates of key suspects",
    "Run predictive risk analysis",
  ];
  return [
    "Search an FIR number",
    "Search a suspect by name",
    "Track a vehicle by plate",
  ];
};

export const AiWorkspace = ({ isOpen, onToggle }) => {
  const { currentContext, activeTab, setActiveTab, messages } = useInvestigation();
  const recommendations = getRecommendations(messages);

  return (
    <div className="h-full flex flex-col rounded-[18px] border border-gray-200 bg-white shadow-sm overflow-hidden w-full">

      {/* Toggle Header */}
      <div className={`flex items-center border-b border-gray-100 shrink-0 px-3 py-3 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Workspace</span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          {isOpen ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* COLLAPSED — vertical icon strip */}
      {!isOpen && (
        <div className="flex flex-col items-center gap-2 pt-3 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => { onToggle(); setActiveTab(tab.name); }}
              title={tab.name}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeTab === tab.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 border border-gray-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              <tab.icon size={14} />
            </button>
          ))}
        </div>
      )}

      {/* OPEN */}
      {isOpen && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Tab Bar — icons + short labels, scrollable */}
          <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                title={tab.name}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 border-b-2 transition-all shrink-0 ${
                  activeTab === tab.name
                    ? 'text-blue-600 border-blue-500'
                    : 'text-slate-400 hover:text-slate-600 border-transparent'
                }`}
              >
                <tab.icon size={14} />
                <span className="text-[9px] font-bold uppercase tracking-wide">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">

            {/* No active context */}
            {!currentContext && (
              <div className="flex flex-col h-full">
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <LayoutDashboard size={20} />
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                    Ask Sentinel about a case, person, or vehicle to populate this workspace.
                  </p>
                </div>
                <div className="px-4 pb-4">
                  <SuggestionsBlock recommendations={recommendations} />
                </div>
              </div>
            )}

            {/* Active context */}
            {currentContext && (
              <div className="flex flex-col">

                {/* Context badge */}
                <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100 shrink-0">
                  <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Active</div>
                  <div className="font-bold text-[14px] text-slate-800 truncate">{currentContext.id}</div>
                  <div className="text-[11px] text-blue-600 font-medium">{currentContext.type} · {currentContext.officer}</div>
                </div>

                {/* Tab content */}
                <div className="p-4">

                  {activeTab === 'Overview' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-[12px] bg-slate-50 border border-gray-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Summary</div>
                        <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
                          Coordinated vehicle thefts in downtown area. Multiple black SUVs stolen between 10PM–2AM over two weeks.
                        </p>
                      </div>
                      <div className="p-3 rounded-[12px] bg-slate-50 border border-gray-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Key Entities</div>
                        <div className="space-y-2">
                          {[
                            { icon: User, label: "Marcus Johnson", sub: "Primary Suspect", color: "text-purple-500 bg-purple-50" },
                            { icon: Car, label: "KA01MX9234", sub: "Target Vehicle", color: "text-blue-500 bg-blue-50" },
                          ].map((e, i) => (
                            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-gray-100">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${e.color}`}>
                                <e.icon size={12} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[12px] font-bold text-slate-700 truncate">{e.label}</div>
                                <div className="text-[10px] text-slate-400">{e.sub}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Timeline' && (
                    <div className="relative ml-3 border-l-2 border-blue-100 pb-4">
                      {[
                        { date: 'Oct 12, 10:30 PM', title: 'Vehicle Stolen', detail: '5th Ave, Downtown' },
                        { date: 'Oct 13, 08:15 AM', title: 'Traffic Cam Match', detail: 'KA01MX9234 headed North' },
                        { date: 'Oct 14, 02:00 PM', title: 'Informant Tip', detail: 'Marcus Johnson linked to drop-off' },
                      ].map((e, i) => (
                        <div key={i} className="relative pl-4 pb-5">
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                          <div className="text-[10px] text-slate-400 font-bold mb-0.5">{e.date}</div>
                          <div className="text-[12px] font-bold text-slate-800">{e.title}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{e.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Graph' && (
                    <div className="w-full h-[200px] rounded-[12px] border border-gray-200 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center justify-center z-10">
                        <FileText size={14} className="text-white" />
                      </div>
                      {[
                        { top: '20%', left: '15%', icon: User, color: 'bg-purple-500' },
                        { top: '15%', right: '15%', icon: User, color: 'bg-purple-500' },
                        { bottom: '20%', left: '10%', icon: Car, color: 'bg-blue-400' },
                        { bottom: '15%', right: '12%', icon: MapPin, color: 'bg-emerald-500' },
                      ].map((n, i) => (
                        <div key={i} className={`absolute w-7 h-7 rounded-full ${n.color} flex items-center justify-center`} style={{ top: n.top, left: n.left, right: n.right, bottom: n.bottom }}>
                          <n.icon size={12} className="text-white" />
                        </div>
                      ))}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                        <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                        <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                        <line x1="50%" y1="50%" x2="15%" y2="78%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                        <line x1="50%" y1="50%" x2="85%" y2="80%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                      </svg>
                      <div className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">Preview</div>
                    </div>
                  )}

                  {['Evidence', 'People', 'Vehicles', 'Reports'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-40">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">No {activeTab} Yet</div>
                      <div className="text-[11px] text-slate-400 text-center">Ask Sentinel to analyze {activeTab.toLowerCase()}.</div>
                    </div>
                  )}

                </div>

                {/* Recommendations */}
                <div className="px-4 pb-4">
                  <SuggestionsBlock recommendations={recommendations} />
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SuggestionsBlock = ({ recommendations }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-2">
      <Lightbulb size={11} className="text-amber-500" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Suggests</span>
    </div>
    <div className="flex flex-col gap-1.5">
      {recommendations.map((r, i) => (
        <div key={i} className="flex items-start gap-2 p-2.5 rounded-[10px] bg-slate-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group">
          <AlertCircle size={11} className="text-blue-400 mt-0.5 shrink-0" />
          <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700 leading-relaxed">{r}</span>
        </div>
      ))}
    </div>
  </div>
);
