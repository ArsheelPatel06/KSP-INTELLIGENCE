import React, { useState } from 'react';
import { FileCheck2, Download, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

const sectionCard = {
  marginBottom: 0,
  padding: '1.25rem',
  borderRadius: '0.75rem',
  backgroundColor: 'var(--t-bg-card)',
  border: '1px solid var(--t-border)',
};

const sectionTitle = {
  fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '0.07em', color: 'var(--t-text-secondary)',
  display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem'
};

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ ...sectionCard, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--t-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck2 size={20} style={{ color: '#3B82F6' }} />
            Executive Intelligence Reports &amp; Case Dossier Generator
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--t-text-secondary)', marginTop: '0.25rem' }}>
            Build print-ready PDF reports with AI summaries, charts, map snapshots, and evidence logs.
          </p>
        </div>
        <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.25rem', backgroundColor: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
          <Printer size={14} /> Export / Print PDF
        </button>
      </div>

      {/* Generator Controls */}
      <div style={{ ...sectionCard, display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
        <div>
          <label className="t-label">Report Template</label>
          <select value={reportType} onChange={e => setReportType(e.target.value)} className="t-input">
            <option value="monthly_summary">Monthly Executive Intelligence Dossier</option>
            <option value="syndicate_dossier">Organized Crime Syndicate Profile</option>
            <option value="cyber_fraud">Cyber Heist Cluster & Financial Analysis</option>
          </select>
        </div>
        <div>
          <label className="t-label">District Jurisdiction</label>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="t-input">
            <option>Bengaluru Urban</option>
            <option>Mysuru</option>
            <option>Hubballi-Dharwad</option>
            <option>Statewide</option>
          </select>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: 'var(--t-text-primary)', paddingBottom: '0.125rem', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={includeAiSynthesis} onChange={e => setIncludeAiSynthesis(e.target.checked)} />
          <Sparkles size={13} style={{ color: '#F59E0B' }} />
          Include AI Synthesis
        </label>
      </div>

      {/* Printable Preview */}
      <div style={{ ...sectionCard, gap: '1.25rem', display: 'flex', flexDirection: 'column' }} className="print:bg-white">
        {/* Doc Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--t-border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#1E3A8A', fontSize: '0.875rem' }}>KSP</div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--t-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Karnataka State Police · Crime Intelligence Division</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--t-text-muted)', fontFamily: 'monospace', marginTop: '0.125rem' }}>
                DOSSIER-{reportType.toUpperCase()}-2026-0725 · CLASSIFIED / EYES ONLY
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge variant="danger" size="md">RESTRICTED</Badge>
            <div style={{ fontSize: '0.625rem', color: 'var(--t-text-muted)', marginTop: '0.25rem' }}>Generated: 25 July 2026</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            1. Executive Crime Overview — {selectedDistrict}
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--t-text-secondary)', lineHeight: 1.7 }}>
            During the July 2026 evaluation window, 1,000 active FIR cases were evaluated across 10 police districts.
            Cyber financial fraud accounted for 38% of total recorded offenses, followed by property theft (24%) and organized syndicate activities.
            Resolution rates maintained an upward trajectory at 78.2%, with 245 cases resolved in Bengaluru Urban.
          </p>
        </div>

        {/* Section 2: AI Synthesis */}
        {includeAiSynthesis && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--t-bg-card-alt)', border: '1px solid var(--t-border)', borderLeft: '3px solid #3B82F6', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              <Sparkles size={13} style={{ color: '#F59E0B' }} />
              2. SENTINEL AI Pattern Synthesis &amp; Predictive Assessment
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--t-text-secondary)', lineHeight: 1.7 }}>
              AI vector clustering identified a high-confidence link between 4 recent cyber heist FIRs in Electronic City and 2 burner SIM cards
              registered to Ramesh 'Snake' Shetty's syndicate. Vector analysis predicts a 14% potential spike in cyber fraud during early August 2026 targeting corporate banking hubs.
            </p>
          </div>
        )}

        {/* Section 3: Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Total FIRs', value: '1,000', color: 'var(--t-text-primary)' },
            { label: 'Solved', value: '782', color: '#10B981' },
            { label: 'Active Probes', value: '142', color: '#F59E0B' },
            { label: 'Mule Accounts', value: '28', color: '#8B5CF6' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', padding: '0.875rem', backgroundColor: 'var(--t-bg-card-alt)', border: '1px solid var(--t-border)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--t-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{m.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--t-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--t-text-secondary)' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--t-text-primary)' }}>DCP Vikram Rathore, IPS</div>
            <div>Deputy Commissioner of Police, Crime Branch</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, color: 'var(--t-text-primary)' }}>ACP Ananya Hegde</div>
            <div>Assistant Commissioner, Cyber Unit</div>
          </div>
        </div>
      </div>

      {/* Archive Table */}
      <div style={sectionCard}>
        <h3 style={sectionTitle}>Archived Intelligence Reports History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="t-table">
            <thead>
              <tr>
                {['Report ID', 'Dossier Title', 'Date', 'Size', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Dossier Title' ? 'left' : 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {archiveReports.map(rep => (
                <tr key={rep.id}>
                  <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: '#3B82F6' }}>{rep.id}</td>
                  <td style={{ fontWeight: 600 }}>{rep.title}</td>
                  <td style={{ textAlign: 'center', color: 'var(--t-text-secondary)' }}>{rep.date}</td>
                  <td style={{ textAlign: 'center', color: 'var(--t-text-muted)' }}>{rep.size}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ padding: '0.125rem 0.5rem', backgroundColor: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700 }}>{rep.status}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => alert(`Downloading ${rep.id}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem', backgroundColor: 'var(--t-bg-card-alt)', border: '1px solid var(--t-border)', color: 'var(--t-text-primary)', borderRadius: '0.375rem', fontSize: '0.625rem', fontWeight: 600, cursor: 'pointer' }}>
                      <Download size={11} /> Download
                    </button>
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
