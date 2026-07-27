import React from 'react';
import { Scale, FileText, Calendar, Shield, Gavel, Download } from 'lucide-react';
import { Btn } from '../../common/ButtonSystem';

export const CourtLegalTab = ({ fir }) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">Court & Legal Proceedings</h3>
        <Btn variant="primary" size="sm" icon={FileText}>Generate Chargesheet</Btn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <Scale size={18} />
            <span className="text-[11px] font-extrabold uppercase tracking-widest">Charges</span>
          </div>
          <div className="text-[24px] font-extrabold text-slate-900 leading-none mb-2">{fir.section || fir.bnsSection || 'BNS 302'}</div>
          <p className="text-[12px] text-slate-500 font-medium">Primary charges filed. Punishable up to 10 years imprisonment.</p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <Calendar size={18} />
            <span className="text-[11px] font-extrabold uppercase tracking-widest">Next Hearing</span>
          </div>
          <div className="text-[24px] font-extrabold text-slate-900 leading-none mb-2">Oct 12, 2026</div>
          <p className="text-[12px] text-slate-500 font-medium">District Court, Room 14A. Officer attendance required.</p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-[16px] shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <Gavel size={18} />
            <span className="text-[11px] font-extrabold uppercase tracking-widest">Status</span>
          </div>
          <div className="text-[24px] font-extrabold text-amber-600 leading-none mb-2">Pre-Trial</div>
          <p className="text-[12px] text-slate-500 font-medium">Waiting for forensics report before chargesheet filing.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
          <h4 className="text-[13px] font-extrabold text-slate-700">Legal Documents</h4>
        </div>
        <div className="p-2 space-y-1">
          {['Initial FIR Copy.pdf', 'Witness_Statements_Batch1.pdf', 'Search_Warrant_Auth.pdf'].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-[12px] transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-slate-400" />
                <span className="text-[13px] font-bold text-slate-800">{doc}</span>
              </div>
              <Btn variant="ghost" size="sm" icon={Download}>Download</Btn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
