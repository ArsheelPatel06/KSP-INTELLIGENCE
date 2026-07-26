import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  LineChart, Line, ComposedChart, Area,
  RadialBarChart, RadialBar
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

// ─── Government Color Palette ───────────────────────────────────────────────
const GOV_TEAL = '#1A7F8E';
const GOV_BLUE = '#1565C0';
const GOV_STEEL = '#2E7D9A';
const GOV_GREEN = '#2E7D32';
const GOV_RED = '#C62828';
const GOV_AMBER = '#E65100';

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
    <div style={{ textAlign: 'center' }}>
      <svg width={140} height={80} viewBox="0 0 140 80">
        {/* Background track */}
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${bgX2} ${bgY2}`} fill="none" stroke="#E0E0E0" strokeWidth={10} strokeLinecap="round" />
        {/* Value arc */}
        {pct > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
        )}
        {/* Center text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="#212121">{value.toLocaleString()}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill={color}>{sublabel}</text>
      </svg>
      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#424242', marginTop: '-0.5rem', lineHeight: 1.4 }}>{label}</div>
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
    <text x={x} y={y} fill="#424242" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={9}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function GovTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD', borderRadius: '4px', padding: '0.5rem 0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: '0.75rem' }}>
      {label && <div style={{ fontWeight: 700, color: '#212121', marginBottom: '0.25rem', borderBottom: '1px solid #E0E0E0', paddingBottom: '0.25rem' }}>{label}</div>}
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || '#424242', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{p.name}:</span><strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export const CrimeAnalyticsPage = () => {
  const { isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Government style: always light background on analytics page (like NeSDA/NJDG)
  const bg = '#F5F5F5';
  const card = '#FFFFFF';
  const border = '#E0E0E0';
  const headerBg = '#1A3A5C';

  const cardStyle = {
    backgroundColor: card,
    border: `1px solid ${border}`,
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
  };

  const cardHeader = (title) => (
    <div style={{ backgroundColor: '#F9F9F9', borderBottom: `1px solid ${border}`, padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, color: '#1A3A5C' }}>
      {title}
    </div>
  );

  // Top KPI summary data
  const kpiSummary = [
    { label: 'Total FIRs', value: '1,000', sub: 'Karnataka State' },
    { label: 'Cases Solved', value: '837', sub: '83.7% resolution rate' },
    { label: 'Active Investigations', value: '163', sub: 'As of today' },
    { label: 'High Risk Cases', value: '27', sub: '2.7% of total' },
    { label: 'Total Persons', value: '2,841', sub: 'Suspects + accused' },
  ];

  // District horizontal bar data
  const districtBar = districtCrimeDistribution.slice(0, 8).map(d => ({
    name: d.district.replace('Bengaluru Urban', 'B\'luru Urban').replace('Hubballi-Dharwad', 'Hubballi'),
    total: d.total,
    solved: d.solved,
  }));

  // Category donut
  const total = crimeCategoryDistribution.reduce((s, d) => s + d.value, 0);
  const categoryColors = ['#1565C0', '#1A7F8E', '#C62828', '#6A1B9A', '#E65100', '#546E7A'];

  // Monthly trend with 3 lines
  const trendData = monthlyCrimeTrends.map(d => ({ ...d, rate: Math.round((d.solved / d.firs) * 100) }));

  // Institute vs Disposal style data
  const ivdData = [
    { period: '2021', instituted: 890, disposed: 754 },
    { period: '2022', instituted: 920, disposed: 801 },
    { period: '2023', instituted: 975, disposed: 856 },
    { period: '2024', instituted: 1010, disposed: 892 },
    { period: '2025', instituted: 1048, disposed: 934 },
    { period: '2026', instituted: 1000, disposed: 837 },
  ];

  // Resolution rate gauge data per category
  const resolutionGauges = [
    { label: 'Cyber Crimes', sub: '79.2% resolved', value: 301, max: 380, color: '#1565C0' },
    { label: 'Property Crimes', sub: '85.8% resolved', value: 206, max: 240, color: GOV_TEAL },
    { label: 'Violent Crimes', sub: '75.0% resolved', value: 120, max: 160, color: GOV_RED },
  ];

  // Syndicate risk table
  const syndicateTable = repeatOffenderStats;

  return (
    <div style={{ backgroundColor: bg, minHeight: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', fontFamily: "'Arial', 'Helvetica', sans-serif" }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: headerBg, borderRadius: '4px', padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <BarChart3 size={18} style={{ color: '#90CAF9' }} />
            <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>State Crime Analytics Dashboard</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#90CAF9', marginTop: '0.25rem' }}>Karnataka State Police · Integrated Crime Intelligence Platform</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.6875rem', color: '#B3D1F0' }}>Last Refreshed: {new Date().toLocaleString('en-IN')}</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', backgroundColor: '#FFFFFF', color: '#1A3A5C', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
          <RefreshCw size={16} style={{ color: '#90CAF9', cursor: 'pointer' }} />
        </div>
      </div>

      {/* ── Row 1: KPI Summary Boxes ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.625rem' }}>
        {kpiSummary.map(k => (
          <div key={k.label} style={{ ...cardStyle, textAlign: 'center', padding: '0.875rem 0.5rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1A3A5C', lineHeight: 1.1, margin: '0.25rem 0' }}>{k.value}</div>
            <div style={{ fontSize: '0.625rem', color: '#9E9E9E' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Resolution Gauges + Category Donut + Category Table ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 1fr', gap: '0.875rem' }}>

        {/* Resolution Rate Gauges */}
        <div style={cardStyle}>
          {cardHeader('Resolution Rate by Crime Category')}
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-around' }}>
            {resolutionGauges.map(g => (
              <HalfGauge key={g.label} value={g.value} max={g.max} color={g.color} label={g.label} sublabel={g.sub} />
            ))}
          </div>
        </div>

        {/* Donut — Crime Category Visibility */}
        <div style={cardStyle}>
          {cardHeader('Crime Category Share')}
          <div style={{ padding: '0.5rem 0' }}>
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
            <div style={{ padding: '0 0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {crimeCategoryDistribution.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#424242', borderBottom: '1px dotted #EEEEEE', paddingBottom: '0.125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: categoryColors[i], display: 'inline-block', borderRadius: '1px', flexShrink: 0 }} />
                    {c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name}
                  </div>
                  <strong>{((c.value / total) * 100).toFixed(1)}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIR Status Summary Table */}
        <div style={cardStyle}>
          {cardHeader('District-wise FIR Summary')}
          <div style={{ overflow: 'auto', maxHeight: '270px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.6875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F5F5', position: 'sticky', top: 0 }}>
                  {['District', 'Total', 'Solved', 'Active', 'Rate%'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.625rem', textAlign: h === 'District' ? 'left' : 'right', fontWeight: 700, color: '#424242', borderBottom: `2px solid ${GOV_TEAL}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {districtCrimeDistribution.map((d, i) => (
                  <tr key={d.district} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                    <td style={{ padding: '0.4rem 0.625rem', color: '#212121', fontWeight: 500 }}>{d.district}</td>
                    <td style={{ padding: '0.4rem 0.625rem', textAlign: 'right', fontWeight: 700, color: GOV_BLUE }}>{d.total}</td>
                    <td style={{ padding: '0.4rem 0.625rem', textAlign: 'right', color: GOV_GREEN, fontWeight: 600 }}>{d.solved}</td>
                    <td style={{ padding: '0.4rem 0.625rem', textAlign: 'right', color: '#E65100' }}>{d.active}</td>
                    <td style={{ padding: '0.4rem 0.625rem', textAlign: 'right' }}>
                      <span style={{ backgroundColor: d.rate >= 80 ? '#E8F5E9' : d.rate >= 75 ? '#FFF8E1' : '#FFEBEE', color: d.rate >= 80 ? GOV_GREEN : d.rate >= 75 ? '#E65100' : GOV_RED, padding: '0.0625rem 0.375rem', borderRadius: '2px', fontWeight: 700 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>

        {/* Monthly Crime Trend (line chart — NJDG style) */}
        <div style={cardStyle}>
          {cardHeader('Monthly FIR Trend — Registered vs Solved')}
          <div style={{ padding: '0.75rem' }}>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#616161' }} />
                <YAxis tick={{ fontSize: 9, fill: '#616161' }} />
                <Tooltip content={<GovTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '0.625rem', paddingTop: '0.25rem' }} />
                <Bar dataKey="firs" name="FIRs Registered" fill={GOV_BLUE} radius={[2, 2, 0, 0]} fillOpacity={0.85}>
                  <LabelList dataKey="firs" position="top" style={{ fontSize: 8, fill: GOV_BLUE, fontWeight: 700 }} />
                </Bar>
                <Line type="monotone" dataKey="solved" name="Cases Solved" stroke={GOV_TEAL} strokeWidth={2.5} dot={{ r: 3, fill: GOV_TEAL }} activeDot={{ r: 5 }}>
                  <LabelList dataKey="solved" position="top" style={{ fontSize: 7, fill: GOV_TEAL, fontWeight: 600 }} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institution vs Disposal (NJDG style) */}
        <div style={cardStyle}>
          {cardHeader('Institution vs. Disposal — Year on Year')}
          <div style={{ padding: '0.75rem' }}>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={ivdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#616161' }} />
                <YAxis tick={{ fontSize: 9, fill: '#616161' }} />
                <Tooltip content={<GovTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '0.625rem', paddingTop: '0.25rem' }} />
                <Area type="monotone" dataKey="instituted" name="Instituted" fill="#BBDEFB" stroke={GOV_BLUE} strokeWidth={2} fillOpacity={0.5} dot={{ r: 3, fill: GOV_BLUE }}>
                  <LabelList dataKey="instituted" position="top" style={{ fontSize: 8, fill: GOV_BLUE, fontWeight: 700 }} />
                </Area>
                <Line type="monotone" dataKey="disposed" name="Disposed" stroke={GOV_RED} strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 3, fill: GOV_RED }}>
                  <LabelList dataKey="disposed" position="top" style={{ fontSize: 8, fill: GOV_RED, fontWeight: 700 }} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 4: Top Districts Bar + AI Forecast ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>

        {/* Top Districts — Horizontal Bar (NeGD style) */}
        <div style={cardStyle}>
          {cardHeader('Top Districts by Total FIRs')}
          <div style={{ padding: '0.75rem' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={districtBar} margin={{ top: 0, right: 50, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#616161' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#424242' }} width={80} />
                <Tooltip content={<GovTooltip />} />
                <Bar dataKey="total" name="Total FIRs" fill={GOV_STEEL} radius={[0, 2, 2, 0]}>
                  <LabelList dataKey="total" position="right" style={{ fontSize: 9, fill: '#424242', fontWeight: 700 }} />
                </Bar>
                <Bar dataKey="solved" name="Solved" fill={GOV_TEAL} radius={[0, 2, 2, 0]}>
                  <LabelList dataKey="solved" position="right" style={{ fontSize: 9, fill: '#424242', fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Forecast Chart */}
        <div style={cardStyle}>
          {cardHeader('AI Predictive Forecast — FIR Volume (3-Month Projection)')}
          <div style={{ padding: '0.75rem' }}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={aiForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#616161' }} angle={-15} textAnchor="end" height={35} />
                <YAxis tick={{ fontSize: 9, fill: '#616161' }} />
                <Tooltip content={<GovTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '0.625rem' }} />
                <Bar dataKey="actual" name="Actual FIRs" fill={GOV_BLUE} radius={[2, 2, 0, 0]} fillOpacity={0.9}>
                  <LabelList dataKey="actual" position="top" style={{ fontSize: 8, fill: GOV_BLUE, fontWeight: 700 }} formatter={(v) => v ?? ''} />
                </Bar>
                <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke={GOV_AMBER} strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4, fill: GOV_AMBER, stroke: '#FFF', strokeWidth: 2 }}>
                  <LabelList dataKey="predicted" position="top" style={{ fontSize: 8, fill: GOV_AMBER, fontWeight: 700 }} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 5: Syndicate Risk Table ──────────────────────────────── */}
      <div style={cardStyle}>
        {cardHeader('Organized Crime Syndicate Risk Index — Active Networks')}
        <div style={{ padding: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#1A3A5C' }}>
                {['#', 'Syndicate / Ring Name', 'Active Members', 'Linked FIRs', 'Risk Score', 'Risk Level'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: h === '#' || h === 'Syndicate / Ring Name' ? 'left' : 'center', fontWeight: 700, color: '#FFFFFF', fontSize: '0.6875rem', letterSpacing: '0.03em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {syndicateTable.map((s, i) => (
                <tr key={s.gang} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F5F9FF', borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '0.5rem 0.75rem', color: '#9E9E9E', fontWeight: 600, fontSize: '0.625rem' }}>{i + 1}</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#212121' }}>{s.gang}</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontWeight: 600, color: GOV_BLUE }}>{s.activeMembers}</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#1A3A5C' }}>{s.linkedFirs}</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, maxWidth: '80px', height: '6px', backgroundColor: '#E0E0E0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.riskScore}%`, height: '100%', backgroundColor: s.riskScore >= 90 ? GOV_RED : s.riskScore >= 80 ? GOV_AMBER : '#F9A825', borderRadius: '9999px' }} />
                      </div>
                      <strong style={{ color: s.riskScore >= 90 ? GOV_RED : s.riskScore >= 80 ? GOV_AMBER : '#F9A825', fontSize: '0.75rem' }}>{s.riskScore}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                    <span style={{ padding: '0.125rem 0.5rem', borderRadius: '2px', fontWeight: 700, fontSize: '0.625rem', backgroundColor: s.riskScore >= 90 ? '#FFEBEE' : s.riskScore >= 80 ? '#FFF8E1' : '#F3F4F6', color: s.riskScore >= 90 ? GOV_RED : s.riskScore >= 80 ? GOV_AMBER : '#616161' }}>
                      {s.riskScore >= 90 ? '🔴 CRITICAL' : s.riskScore >= 80 ? '🟠 HIGH' : '🟡 MEDIUM'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row 6: Offense Type Breakdown — Small summary stats ─────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
        {[
          { label: 'Instituted This Month', items: [{ k: 'Cyber', v: 48 }, { k: 'Property', v: 29 }, { k: 'Violent', v: 18 }, { k: 'Total', v: 95 }] },
          { label: 'Disposed This Month', items: [{ k: 'Cyber', v: 41 }, { k: 'Property', v: 24 }, { k: 'Violent', v: 14 }, { k: 'Total', v: 79 }] },
          { label: 'Disposal Rate (Current Year)', items: [{ k: 'Cyber', v: '79.2%' }, { k: 'Property', v: '85.8%' }, { k: 'Violent', v: '75.0%' }, { k: 'Overall', v: '83.7%' }] },
        ].map(section => (
          <div key={section.label} style={cardStyle}>
            <div style={{ backgroundColor: GOV_TEAL, padding: '0.375rem 0.875rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#FFFFFF' }}>{section.label}</div>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {section.items.map((item, i) => (
                <div key={item.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0.875rem', borderBottom: i < section.items.length - 1 ? `1px solid ${border}` : 'none', backgroundColor: item.k === 'Total' || item.k === 'Overall' ? '#F0F4FF' : '#FFF' }}>
                  <span style={{ fontSize: '0.75rem', color: '#424242', fontWeight: item.k === 'Total' || item.k === 'Overall' ? 700 : 400 }}>{item.k}</span>
                  <strong style={{ fontSize: '0.875rem', color: item.k === 'Total' || item.k === 'Overall' ? GOV_BLUE : '#212121' }}>{item.v}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
