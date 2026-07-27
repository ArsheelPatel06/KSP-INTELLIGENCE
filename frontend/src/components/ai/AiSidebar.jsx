import React from 'react';
import { Plus, Network, FileText, Clock, Car, ShieldAlert, ChevronLeft, ChevronRight, MessageSquare, Bot } from 'lucide-react';

const smartTemplates = [
  { label: "Find Mastermind", icon: Network },
  { label: "Generate Timeline", icon: Clock },
  { label: "Track Vehicle", icon: Car },
  { label: "Generate Report", icon: FileText },
  { label: "Show Network", icon: Network },
  { label: "IPC Analysis", icon: ShieldAlert },
];

const history = [
  { id: "Cyber Fraud Cluster", msgs: 14, time: "3 mins ago", officer: "DCP Rathore", active: true },
  { id: "Vehicle Theft Ring", msgs: 8, time: "2 hrs ago", officer: "Insp. Sharma", active: false },
  { id: "Missing Person: John Doe", msgs: 32, time: "5 hrs ago", officer: "DCP Rathore", active: false },
  { id: "Downtown Syndicate", msgs: 112, time: "1 day ago", officer: "ACP Singh", active: false },
  { id: "Narcotics Drop Point", msgs: 5, time: "2 days ago", officer: "Insp. Sharma", active: false },
  { id: "Financial Embezzlement", msgs: 45, time: "3 days ago", officer: "DCP Rathore", active: false },
  { id: "Arms Smuggling Route", msgs: 89, time: "1 week ago", officer: "ACP Singh", active: false },
  { id: "Ramesh Shetty Analysis", msgs: 12, time: "1 week ago", officer: "DCP Rathore", active: false },
];

export const AiSidebar = ({ isOpen, onToggle, onNewInvestigation, onHistoryClick, onTemplateClick }) => {
  return (
    <div className="h-full flex flex-col rounded-[18px] border border-gray-200 bg-white shadow-sm overflow-hidden">
      
      {/* Toggle Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="text-[13px] font-bold text-slate-700">Sentinel</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors ${!isOpen ? 'mx-auto' : ''}`}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Collapsed state — just icons */}
      {!isOpen && (
        <div className="flex-1 flex flex-col items-center gap-2 pt-3">
          <button onClick={onNewInvestigation} className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors" title="New Investigation">
            <Plus size={16} />
          </button>
          {smartTemplates.slice(0, 5).map((t, i) => (
            <button key={i} onClick={() => onTemplateClick(t.label)} className="w-8 h-8 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:border-blue-300 transition-colors" title={t.label}>
              <t.icon size={14} />
            </button>
          ))}
        </div>
      )}

      {/* Open state */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          
          {/* New Investigation */}
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={onNewInvestigation}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white transition-all group"
            >
              <div className="w-7 h-7 rounded-[8px] bg-white/20 flex items-center justify-center shrink-0">
                <Plus size={15} className="group-hover:rotate-90 transition-transform duration-200" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-bold leading-tight">New Investigation</div>
                <div className="text-[10px] text-blue-200 mt-0.5">FIR • Person • Vehicle</div>
              </div>
            </button>
          </div>

          {/* Smart Templates */}
          <div className="p-3 border-b border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Templates</div>
            <div className="flex flex-col gap-1">
              {smartTemplates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => onTemplateClick(t.label)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[13px] font-medium transition-all group text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                    <t.icon size={12} className="text-blue-500" />
                  </div>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">History</div>
              <button className="text-[11px] font-bold text-blue-500">All</button>
            </div>
            <div className="flex flex-col gap-0.5">
              {history.map((inv, i) => (
                <button
                  key={i}
                  onClick={() => onHistoryClick(inv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-[10px] transition-all ${
                    inv.active 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${inv.active ? 'bg-blue-500' : 'bg-slate-300'}`} />
                    <span className="text-[12px] font-semibold truncate">{inv.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-3">
                    <MessageSquare size={9} />
                    <span>{inv.msgs}</span>
                    <span>·</span>
                    <span>{inv.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
