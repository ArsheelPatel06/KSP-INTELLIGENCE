import React, { useState } from 'react';
import { FileCheck2, Download, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { Btn, BtnIcon } from '../components/common/ButtonSystem';

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('monthly_summary');
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru Urban');
  const [includeAiSynthesis, setIncludeAiSynthesis] = useState(true);

  const archiveReports = [
    { id: 'REP-2026-07', title: 'Monthly Crime & Intelligence Summary - July 2026', date: '2026-07-24', size: '14.2 MB', status: 'Approved by DCP' },
    { id: 'REP-2026-06', title: 'Cyber Financial Fraud Cluster Special Briefing', date: '2026-06-30', size: '8.7 MB', status: 'Submitted to CID' },
    { id: 'REP-2026-05', title: 'Statewide Organized Crime Syndicate Assessment', date: '2026-05-31', size: '22.1 MB', status: 'Archived' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fade-in font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck2 size={24} className="text-blue-600" />
            Executive Intelligence Reports &amp; Case Dossier
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Build print-ready PDF reports with AI summaries, charts, map snapshots, and evidence logs.
          </p>
        </div>
        <Btn variant="primary" size="md" icon={Printer} onClick={() => window.print()}>
          Export / Print PDF
        </Btn>
      </div>

      {/* Generator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm items-end">
        <div>
          <label className="block text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Report Template</label>
          <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full h-11 px-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[14px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white appearance-none cursor-pointer">
            <option value="monthly_summary">Monthly Executive Intelligence Dossier</option>
            <option value="syndicate_dossier">Organized Crime Syndicate Profile</option>
            <option value="cyber_fraud">Cyber Heist Cluster &amp; Financial Analysis</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">District Jurisdiction</label>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="w-full h-11 px-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[14px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white appearance-none cursor-pointer">
            <option>Bengaluru Urban</option>
            <option>Mysuru</option>
            <option>Hubballi-Dharwad</option>
            <option>Statewide</option>
          </select>
        </div>
        <div className="flex h-11 items-center px-4 bg-slate-50 border border-gray-200 rounded-[12px] cursor-pointer hover:border-blue-200 transition-colors" onClick={() => setIncludeAiSynthesis(!includeAiSynthesis)}>
          <input 
            type="checkbox" 
            checked={includeAiSynthesis} 
            onChange={e => setIncludeAiSynthesis(e.target.checked)}
            className="w-4 h-4 rounded-[4px] border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-3"
            onClick={e => e.stopPropagation()}
          />
          <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-700">
            <Sparkles size={16} className="text-amber-500" /> Include AI Synthesis
          </div>
        </div>
      </div>

      {/* Printable Preview */}
      <div className="bg-white border border-gray-200 rounded-[18px] p-8 shadow-sm flex flex-col gap-6 print:border-none print:shadow-none print:p-0">
        
        {/* Doc Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-blue-50 border border-blue-200 flex items-center justify-center font-extrabold text-blue-700 text-[16px]">KSP</div>
            <div>
              <div className="text-[16px] font-extrabold text-slate-900 uppercase tracking-wide">Karnataka State Police · Crime Intelligence Division</div>
              <div className="text-[12px] text-slate-500 font-mono mt-0.5">DOSSIER-{reportType.toUpperCase()}-2026-0725 · CLASSIFIED / EYES ONLY</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-[6px] text-[11px] font-extrabold tracking-widest uppercase mb-1">Restricted</span>
            <div className="text-[11px] text-slate-400 font-medium">Generated: 25 July 2026</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div>
          <div className="text-[13px] font-extrabold text-blue-600 uppercase tracking-widest mb-3">1. Executive Crime Overview — {selectedDistrict}</div>
          <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
            During the July 2026 evaluation window, 1,000 active FIR cases were evaluated across 10 police districts.
            Cyber financial fraud accounted for 38% of total recorded offenses, followed by property theft (24%) and organized syndicate activities.
            Resolution rates maintained an upward trajectory at 78.2%, with 245 cases resolved in Bengaluru Urban.
          </p>
        </div>

        {/* Section 2: AI Synthesis */}
        {includeAiSynthesis && (
          <div className="p-5 bg-blue-50 border border-blue-100 border-l-4 border-l-blue-500 rounded-r-[12px] rounded-l-[4px]">
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-blue-700 uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-amber-500" />
              2. SENTINEL AI Pattern Synthesis &amp; Predictive Assessment
            </div>
            <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
              AI vector clustering identified a high-confidence link between 4 recent cyber heist FIRs in Electronic City and 2 burner SIM cards
              registered to Ramesh 'Snake' Shetty's syndicate. Vector analysis predicts a 14% potential spike in cyber fraud during early August 2026 targeting corporate banking hubs.
            </p>
          </div>
        )}

        {/* Section 3: Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total FIRs', value: '1,000', color: 'text-slate-800' },
            { label: 'Solved', value: '782', color: 'text-emerald-600' },
            { label: 'Active Probes', value: '142', color: 'text-amber-600' },
            { label: 'Mule Accounts', value: '28', color: 'text-purple-600' },
          ].map(m => (
            <div key={m.label} className="text-center p-4 bg-slate-50 border border-gray-100 rounded-[14px]">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">{m.label}</div>
              <div className={`text-[28px] font-extrabold leading-none ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-gray-100 flex justify-between mt-4">
          <div>
            <div className="text-[14px] font-extrabold text-slate-900">DCP Vikram Rathore, IPS</div>
            <div className="text-[12px] font-medium text-slate-500">Deputy Commissioner of Police, Crime Branch</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-extrabold text-slate-900">ACP Ananya Hegde</div>
            <div className="text-[12px] font-medium text-slate-500">Assistant Commissioner, Cyber Unit</div>
          </div>
        </div>
      </div>

      {/* Archive Table */}
      <div className="bg-white border border-gray-200 rounded-[18px] shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 text-[12px] font-extrabold text-slate-700 uppercase tracking-widest">
          Archived Intelligence Reports History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-widest text-slate-400 font-extrabold">
              <tr>
                {['Report ID', 'Dossier Title', 'Date', 'Size', 'Status', 'Action'].map(h => (
                  <th key={h} className={`px-5 py-4 ${h === 'Dossier Title' ? '' : 'text-center'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {archiveReports.map(rep => (
                <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-center font-mono font-bold text-blue-600 text-[12px]">{rep.id}</td>
                  <td className="px-5 py-4 font-extrabold text-slate-800">{rep.title}</td>
                  <td className="px-5 py-4 text-center font-medium text-slate-500 text-[12px]">{rep.date}</td>
                  <td className="px-5 py-4 text-center font-medium text-slate-400 text-[12px]">{rep.size}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[6px] text-[11px] font-extrabold">
                      {rep.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Btn variant="secondary" size="sm" icon={Download} onClick={() => alert(`Downloading ${rep.id}`)}>
                      Download
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
