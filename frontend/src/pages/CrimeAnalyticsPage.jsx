import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  LineChart, Line, ComposedChart, Area,
} from 'recharts';
import { Download, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import {
  monthlyCrimeTrends,
  crimeCategoryDistribution,
  districtCrimeDistribution,
  repeatOffenderStats,
  aiForecastData
} from '../mockData/mockAnalytics';
import { useApp } from '../context/AppContext';
import { Btn, BtnIcon } from '../components/common/ButtonSystem';

// ─── Color Palette ────────────────────────────────────────────────────────
const GOV_TEAL = '#0891b2';
const GOV_BLUE = '#2563eb';
const GOV_STEEL = '#475569';
const GOV_GREEN = '#16a34a';
const GOV_RED = '#dc2626';
const GOV_AMBER = '#ea580c';

// ─── Half-Circle Gauge (SVG) ─────────────────────────────────────────────────
function HalfGauge({ value, max, color, label, sublabel }) {
  const pct = Math.min(value / max, 1);
  const r = 52, cx = 70, cy = 65;
  const start = Math.PI, end = 0;
  const angle = start - pct * Math.PI;
  const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
  const large = pct > 0.5 ? 1 : 0;
  const bgX2 = cx + r * Math.cos(end), bgY2 = cy + r * Math.sin(end);

  return (
    <div className="text-center">
      <svg width={140} height={90} viewBox="0 0 140 90">
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${bgX2} ${bgY2}`} fill="none" stroke="#f1f5f9" strokeWidth={10} strokeLinecap="round" />
        {pct > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
        )}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={14} fontWeight={800} fill="#1e293b">{value.toLocaleString()}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill={color} fontWeight={600}>{sublabel}</text>
      </svg>
      <div className="text-[12px] font-bold text-slate-600 mt-1 leading-tight">{label}</div>
    </div>
  );
}

// ─── Donut Chart with center label ──────────────────────────────────────────
const RADIAN = Math.PI / 180;
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) {
  const r = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function GovTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] p-3 shadow-lg text-[12px]">
      {label && <div className="font-bold text-slate-800 mb-2 border-b border-gray-100 pb-2">{label}</div>}
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4 font-medium" style={{ color: p.color || '#475569' }}>
          <span>{p.name}:</span><strong className="font-extrabold text-slate-900">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export const CrimeAnalyticsPage = () => {
  const { isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const cardHeader = (title) => (
    <div className="bg-slate-50 border-b border-gray-100 px-4 py-3 text-[12px] font-extrabold text-slate-700 uppercase tracking-widest rounded-t-[16px]">
      {title}
    </div>
  );

  // Top KPI summary data
  const kpiSummary = [
    { label: 'Total FIRs', value: '1,000', sub: 'Karnataka State', color: 'text-slate-700' },
    { label: 'Cases Solved', value: '837', sub: '83.7% resolution rate', color: 'text-blue-600' },
    { label: 'Active Investigations', value: '163', sub: 'As of today', color: 'text-amber-600' },
    { label: 'High Risk Cases', value: '27', sub: '2.7% of total', color: 'text-red-600' },
    { label: 'Total Persons', value: '2,841', sub: 'Suspects + accused', color: 'text-indigo-600' },
  ];

  // District horizontal bar data
  const districtBar = districtCrimeDistribution.slice(0, 8).map(d => ({
    name: d.district.replace('Bengaluru Urban', 'B\'luru Urban').replace('Hubballi-Dharwad', 'Hubballi'),
    total: d.total,
    solved: d.solved,
  }));

  // Category donut
  const total = crimeCategoryDistribution.reduce((s, d) => s + d.value, 0);
  const categoryColors = ['#2563eb', '#0891b2', '#dc2626', '#9333ea', '#ea580c', '#475569'];

  // Monthly trend
  const trendData = monthlyCrimeTrends.map(d => ({ ...d, rate: Math.round((d.solved / d.firs) * 100) }));

  // Institute vs Disposal data
  const ivdData = [
    { period: '2021', instituted: 890, disposed: 754 },
    { period: '2022', instituted: 920, disposed: 801 },
    { period: '2023', instituted: 975, disposed: 856 },
    { period: '2024', instituted: 1010, disposed: 892 },
    { period: '2025', instituted: 1048, disposed: 934 },
    { period: '2026', instituted: 1000, disposed: 837 },
  ];

  // Resolution rate gauges
  const resolutionGauges = [
    { label: 'Cyber Crimes', sub: '79.2% resolved', value: 301, max: 380, color: '#2563eb' },
    { label: 'Property Crimes', sub: '85.8% resolved', value: 206, max: 240, color: '#0891b2' },
    { label: 'Violent Crimes', sub: '75.0% resolved', value: 120, max: 160, color: '#dc2626' },
  ];

  // Syndicate risk table
  const syndicateTable = repeatOffenderStats;

  return (
    <div className="flex flex-col gap-4 pb-8 animate-fade-in">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" />
            <span>State Crime Analytics Dashboard</span>
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Karnataka State Police · Integrated Crime Intelligence Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-400 font-medium mr-2">Last Refreshed: {new Date().toLocaleString('en-IN')}</span>
          <Btn variant="secondary" size="md" icon={Download}>Export Report</Btn>
          <BtnIcon variant="ghost" icon={RefreshCw} title="Refresh Data" />
        </div>
      </div>

      {/* ── Row 1: KPI Summary Boxes ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpiSummary.map(k => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-4 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{k.label}</div>
            <div className={`text-[26px] font-extrabold leading-none my-2 ${k.color}`}>{k.value}</div>
            <div className="text-[11px] font-medium text-slate-500">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Resolution Gauges + Category Donut + Category Table ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1.6fr] xl:grid-cols-[1fr_250px_1.5fr] gap-4">
        
        {/* Resolution Rate Gauges */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col h-full">
          {cardHeader('Resolution Rate by Crime Category')}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full flex justify-around">
              {resolutionGauges.map(g => (
                <HalfGauge key={g.label} value={g.value} max={g.max} color={g.color} label={g.label} sublabel={g.sub} />
              ))}
            </div>
            <div className="mt-6 text-[11px] text-slate-400 font-medium text-center bg-slate-50 py-1.5 px-4 rounded-full border border-gray-100">
              * Rates reflect cases closed or charge-sheeted within 90 days.
            </div>
          </div>
        </div>

        {/* Donut — Crime Category Visibility */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm">
          {cardHeader('Crime Category Share')}
          <div className="p-3">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={crimeCategoryDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={62} labelLine={false} label={renderCustomLabel}>
                  {crimeCategoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={categoryColors[i]} />
                  ))}
                </Pie>
                <Tooltip content={<GovTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-1 px-2">
              {crimeCategoryDistribution.map((c, i) => (
                <div key={c.name} className="flex justify-between text-[11px] text-slate-600 border-b border-gray-100 border-dashed pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: categoryColors[i] }} />
                    <span className="font-medium">{c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name}</span>
                  </div>
                  <strong className="text-slate-800">{((c.value / total) * 100).toFixed(1)}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIR Status Summary Table */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col">
          {cardHeader('District-wise FIR Summary')}
          <div className="overflow-x-auto overflow-y-auto max-h-[270px]">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-gray-200 shadow-sm z-10">
                <tr>
                  {['District', 'Total', 'Solved', 'Active', 'Rate%'].map(h => (
                    <th key={h} className={`px-2 lg:px-3 py-2 font-extrabold text-slate-600 uppercase tracking-widest text-[10px] whitespace-nowrap ${h !== 'District' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {districtCrimeDistribution.map((d) => (
                  <tr key={d.district} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 lg:px-3 py-2 font-bold text-slate-800 whitespace-nowrap">{d.district}</td>
                    <td className="px-2 lg:px-3 py-2 text-right font-extrabold text-blue-600">{d.total}</td>
                    <td className="px-2 lg:px-3 py-2 text-right font-extrabold text-emerald-600">{d.solved}</td>
                    <td className="px-2 lg:px-3 py-2 text-right font-extrabold text-amber-600">{d.active}</td>
                    <td className="px-2 lg:px-3 py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded-[4px] font-bold whitespace-nowrap ${
                        d.rate >= 80 ? 'bg-emerald-50 text-emerald-700' :
                        d.rate >= 75 ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {d.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 3: Monthly Trend + Institution vs Disposal ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly Crime Trend */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm">
          {cardHeader('Monthly FIR Trend — Registered vs Solved')}
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<GovTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                <Bar dataKey="firs" name="FIRs Registered" fill={GOV_BLUE} radius={[4, 4, 0, 0]} barSize={30}>
                  <LabelList dataKey="firs" position="top" style={{ fontSize: 10, fill: GOV_BLUE, fontWeight: 700 }} />
                </Bar>
                <Line type="monotone" dataKey="solved" name="Cases Solved" stroke={GOV_TEAL} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }}>
                  <LabelList dataKey="solved" position="top" style={{ fontSize: 10, fill: GOV_TEAL, fontWeight: 700 }} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institution vs Disposal */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm">
          {cardHeader('Institution vs. Disposal — Year on Year')}
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={ivdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<GovTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                <Area type="monotone" dataKey="instituted" name="Instituted" fill="#eff6ff" stroke={GOV_BLUE} strokeWidth={2} fillOpacity={1} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                <Line type="monotone" dataKey="disposed" name="Disposed" stroke={GOV_RED} strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 4: Top Districts Bar + AI Forecast ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top Districts */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm">
          {cardHeader('Top Districts by Total FIRs')}
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart layout="vertical" data={districtBar} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<GovTooltip />} />
                <Bar dataKey="total" name="Total FIRs" fill={GOV_STEEL} radius={[0, 4, 4, 0]} barSize={12}>
                  <LabelList dataKey="total" position="right" style={{ fontSize: 10, fill: GOV_STEEL, fontWeight: 700 }} />
                </Bar>
                <Bar dataKey="solved" name="Solved" fill={GOV_TEAL} radius={[0, 4, 4, 0]} barSize={12}>
                  <LabelList dataKey="solved" position="right" style={{ fontSize: 10, fill: GOV_TEAL, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Forecast Chart */}
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm">
          {cardHeader('AI Predictive Forecast — FIR Volume (3-Month Projection)')}
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={aiForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<GovTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Actual FIRs" fill={GOV_BLUE} radius={[4, 4, 0, 0]} barSize={30}>
                  <LabelList dataKey="actual" position="top" style={{ fontSize: 10, fill: GOV_BLUE, fontWeight: 700 }} formatter={(v) => v ?? ''} />
                </Bar>
                <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke={GOV_AMBER} strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}>
                  <LabelList dataKey="predicted" position="top" style={{ fontSize: 10, fill: GOV_AMBER, fontWeight: 700 }} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 5: Syndicate Risk Table ──────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden">
        {cardHeader('Organized Crime Syndicate Risk Index — Active Networks')}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase tracking-widest text-slate-500 font-extrabold">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Syndicate / Ring Name</th>
                <th className="px-6 py-4 text-center">Active Members</th>
                <th className="px-6 py-4 text-center">Linked FIRs</th>
                <th className="px-6 py-4 text-center">Risk Score</th>
                <th className="px-6 py-4 text-center">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {syndicateTable.map((s, i) => (
                <tr key={s.gang} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">{i + 1}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">{s.gang}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">{s.activeMembers}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{s.linkedFirs}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${s.riskScore}%`,
                            backgroundColor: s.riskScore >= 90 ? GOV_RED : s.riskScore >= 80 ? GOV_AMBER : '#eab308' 
                          }}
                        />
                      </div>
                      <strong className={`text-[13px] ${s.riskScore >= 90 ? 'text-red-600' : s.riskScore >= 80 ? 'text-amber-600' : 'text-yellow-600'}`}>
                        {s.riskScore}
                      </strong>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-[11px] font-extrabold rounded-full ${
                      s.riskScore >= 90 ? 'bg-red-50 text-red-700 border border-red-200' : 
                      s.riskScore >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                      'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}>
                      {s.riskScore >= 90 ? '🔴 CRITICAL' : s.riskScore >= 80 ? '🟠 HIGH' : '🟡 MEDIUM'}
                    </span>
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
