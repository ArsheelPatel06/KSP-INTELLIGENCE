import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Shield, BrainCircuit, AlertTriangle, FolderOpen, ArrowRight,
  TrendingUp, TrendingDown, Minus, MapPin, Clock, Bell, Zap,
  Users, FileText, Activity, Radio, CheckCircle, XCircle,
  ChevronRight, Target, Eye, Play, Search, Star, Map,
  BarChart2, Cpu, Database, Wifi, RefreshCw, MoreHorizontal,
  AlertCircle, Info, Crosshair, UserCheck, Calendar
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis,
  Tooltip, Bar, Line, Area, AreaChart
} from 'recharts';
import { aiForecastData, monthlyCrimeTrends } from '../mockData/mockAnalytics';
import { dashboardService } from '../services/dashboard.service';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const kpiData = [
  { label: 'Total FIRs', value: '1,000', trend: '+4.2%', up: true, icon: FileText, color: '#3B82F6', spark: [80,90,85,100,95,110,105] },
  { label: 'Active Investigations', value: '142', trend: '+2.1%', up: true, icon: FolderOpen, color: '#8B5CF6', spark: [120,125,130,128,135,140,142] },
  { label: 'High Risk Cases', value: '27', trend: '+12%', up: true, icon: AlertTriangle, color: '#EF4444', spark: [18,20,22,21,24,25,27] },
  { label: "Today's New FIRs", value: '14', trend: '-3%', up: false, icon: Bell, color: '#F59E0B', spark: [10,12,18,15,14,16,14] },
  { label: 'Crime Hotspots', value: '6', trend: '0%', up: null, icon: MapPin, color: '#06B6D4', spark: [4,5,6,5,6,7,6] },
  { label: 'AI Matches', value: '39', trend: '+18%', up: true, icon: BrainCircuit, color: '#10B981', spark: [20,25,28,30,33,36,39] },
  { label: 'Pending Reviews', value: '18', trend: '-5%', up: false, icon: Clock, color: '#F97316', spark: [25,24,22,21,20,19,18] },
  { label: 'Officer Efficiency', value: '82%', trend: '+1.4%', up: true, icon: UserCheck, color: '#6366F1', spark: [76,77,79,80,80,81,82] },
];

const aiDiscoveries = [
  { id: 1, title: 'Cyber Fraud Cluster', confidence: 98, evidence: '7 FIRs', detail: 'Potential Mastermind: Ramesh Shetty', type: 'cluster', color: '#EF4444', fir: 'FIR-2026-089' },
  { id: 2, title: 'Vehicle Theft Pattern', confidence: 94, evidence: '5 FIRs linked', detail: 'Same vehicle, same route identified', type: 'pattern', color: '#F59E0B', fir: 'FIR-2026-104' },
  { id: 3, title: 'Chain Snatching Forecast', confidence: 87, evidence: 'Hotspot: Jayanagar', detail: '↑ 18% expected in next 72 hours', type: 'forecast', color: '#8B5CF6', fir: null },
];

const criticalAlerts = [
  { id: 'ALT-891', level: 'HIGH', color: '#EF4444', bg: '#FEF2F2', dot: '🔴', title: 'IMEI Detected', desc: 'Electronic City Tower 3', time: '2 mins ago' },
  { id: 'ALT-890', level: 'MEDIUM', color: '#F59E0B', bg: '#FFFBEB', dot: '🟠', title: 'Vehicle Spotted', desc: 'Suspect KA-01-MX-9234 on MG Road', time: '15 mins ago' },
  { id: 'ALT-889', level: 'INFO', color: '#3B82F6', bg: '#EFF6FF', dot: '🔵', title: 'New FIR Registered', desc: 'FIR-2026-122 — Whitefield PS', time: '30 mins ago' },
  { id: 'ALT-888', level: 'HIGH', color: '#EF4444', bg: '#FEF2F2', dot: '🔴', title: 'Account Freeze Alert', desc: 'HDFC xxxxxx7891 — Frozen', time: '42 mins ago' },
];

const crimeCategories = [
  { name: 'Cyber', pct: 38, trend: 'up', color: '#3B82F6' },
  { name: 'Property', pct: 24, trend: 'down', color: '#06B6D4' },
  { name: 'Violent', pct: 16, trend: 'up', color: '#EF4444' },
  { name: 'Financial', pct: 12, trend: 'up', color: '#8B5CF6' },
  { name: 'Drug', pct: 10, trend: 'flat', color: '#10B981' },
];

const aiRecommendations = [
  { action: 'Deploy', detail: '2 patrol units — Electronic City', confidence: 97, color: '#EF4444' },
  { action: 'Freeze', detail: 'HDFC Account xxxxxx7891', confidence: 95, color: '#F59E0B' },
  { action: 'Question', detail: 'Witness Priya Menon — FIR-429', confidence: 91, color: '#8B5CF6' },
];

const officerTasks = [
  { fir: 'FIR-421', task: 'Review Case File', due: 'Today', priority: 'High', color: '#EF4444' },
  { fir: 'FIR-388', task: 'Approve Forensic Report', due: 'Tomorrow', priority: 'Medium', color: '#F59E0B' },
  { fir: 'FIR-429', task: 'Interview Witness', due: '3:00 PM', priority: 'High', color: '#EF4444' },
  { fir: 'FIR-401', task: 'Generate Court Report', due: 'Pending', priority: 'Low', color: '#10B981' },
];

const recentInvestigations = [
  { fir: 'FIR-2026-089', title: 'Syndicate Cyber Fraud', status: 'Critical', officer: 'DCP Rathore', aiScore: 98, statusColor: '#EF4444' },
  { fir: 'FIR-2026-092', title: 'Commercial Burglary Series', status: 'Active', officer: 'Insp. Kumar', aiScore: 84, statusColor: '#F59E0B' },
  { fir: 'FIR-2026-104', title: 'Vehicle Theft Ring', status: 'Active', officer: 'SI Nair', aiScore: 91, statusColor: '#F59E0B' },
  { fir: 'FIR-2026-112', title: 'Financial Fraud — HDFC', status: 'Review', officer: 'DCP Rathore', aiScore: 76, statusColor: '#8B5CF6' },
];

const officerPerformance = [
  { name: 'DCP V. Rathore', cases: 34, solved: 28, efficiency: 82, load: 'High', aiScore: 91 },
  { name: 'Insp. R. Kumar', cases: 22, solved: 19, efficiency: 86, load: 'Medium', aiScore: 87 },
  { name: 'SI A. Nair', cases: 18, solved: 14, efficiency: 78, load: 'Medium', aiScore: 80 },
  { name: 'HC D. Sharma', cases: 11, solved: 9, efficiency: 82, load: 'Low', aiScore: 84 },
];

const upcomingDeadlines = [
  { title: 'Charge Sheet — FIR-089', when: 'Today, 4:00 PM', urgency: 'high' },
  { title: 'Court Hearing — FIR-082', when: 'Tomorrow, 10:30 AM', urgency: 'medium' },
  { title: 'Evidence Submission — FIR-071', when: 'Friday, 5:00 PM', urgency: 'low' },
];

const feedEvents = [
  { time: '12:01', type: 'IMEI', msg: 'IMEI Ping — Electronic City Tower' },
  { time: '12:05', type: 'FIR', msg: 'New FIR Registered — Whitefield PS' },
  { time: '12:08', type: 'CDR', msg: 'CDR Records Uploaded — FIR-2026-104' },
  { time: '12:10', type: 'AI', msg: 'AI Linked Case-028 ↔ Case-039' },
  { time: '12:11', type: 'LOGIN', msg: 'Officer Nair logged in — Remote' },
  { time: '12:14', type: 'ALERT', msg: 'Account Freeze triggered — HDFC' },
  { time: '12:17', type: 'AI', msg: 'Pattern detected — Chain snatching cluster' },
  { time: '12:21', type: 'FIR', msg: 'FIR-2026-122 registered — Indiranagar' },
];

const hotspotZones = [
  { name: 'Electronic City', x: 62, y: 70, risk: 'HIGH', crimes: 12 },
  { name: 'MG Road', x: 48, y: 40, risk: 'HIGH', crimes: 9 },
  { name: 'Jayanagar', x: 44, y: 55, risk: 'MEDIUM', crimes: 6 },
  { name: 'Whitefield', x: 72, y: 38, risk: 'MEDIUM', crimes: 7 },
  { name: 'Koramangala', x: 54, y: 58, risk: 'LOW', crimes: 4 },
  { name: 'Hebbal', x: 46, y: 22, risk: 'LOW', crimes: 3 },
];

// ─── Mini Sparkline ──────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const min = Math.min(...data), max = Math.max(...data);
  const h = 28, w = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 0.001)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Feed Item ───────────────────────────────────────────────────────────────
const feedColors = { IMEI: '#06B6D4', FIR: '#3B82F6', CDR: '#8B5CF6', AI: '#10B981', LOGIN: '#F59E0B', ALERT: '#EF4444' };

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useApp();
  const navigate = useNavigate();
  const feedRef = useRef(null);

  const [feedItems, setFeedItems] = useState(feedEvents);
  const [liveTime, setLiveTime] = useState(new Date());
  const [showAIChat, setShowAIChat] = useState(false);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard API Data
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await dashboardService.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [feedItems]);

  // Simulate incoming feed
  useEffect(() => {
    const t = setInterval(() => {
      const types = ['AI', 'ALERT', 'FIR', 'CDR'];
      const msgs = ['AI pattern updated', 'New evidence logged', 'FIR status changed', 'CDR sync completed'];
      const idx = Math.floor(Math.random() * 4);
      const now = new Date();
      setFeedItems(prev => [...prev.slice(-15), {
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        type: types[idx],
        msg: msgs[idx]
      }]);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // Theme tokens
  const bg = isDarkMode ? '#070D19' : '#F1F5F9';
  const card = isDarkMode ? '#0B1120' : '#FFFFFF';
  const border = isDarkMode ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDarkMode ? '#F1F5F9' : '#0F172A';
  const textSecondary = isDarkMode ? '#94A3B8' : '#64748B';
  const sectionLabel = { fontSize: '0.6875rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' };
  const cardStyle = { backgroundColor: card, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '1.25rem', boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.06)' };

  const gridLine = isDarkMode ? '#1E293B' : '#E2E8F0';
  const tooltipStyle = { backgroundColor: isDarkMode ? '#0E1525' : '#FFF', borderColor: border, borderRadius: '0.5rem', color: textPrimary, fontSize: '0.75rem' };

  return (
    <div style={{ backgroundColor: bg, minHeight: '100%', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── ROW 1: AI SITUATION BANNER ─────────────────────────────────── */}
      <div style={{ background: isDarkMode ? 'linear-gradient(135deg, #0D1B2A 0%, #1E3A8A 60%, #0D1B2A 100%)' : 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 60%, #1E3A8A 100%)', borderRadius: '0.75rem', padding: '1.5rem 2rem', border: `1px solid ${isDarkMode ? '#1E3A8A' : '#1D4ED8'}`, position: 'relative', overflow: 'hidden' }}>
        {/* Animated background pulse */}
        <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '10rem', height: '10rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '50%', animation: 'pulse 3s infinite' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '30%', width: '14rem', height: '14rem', backgroundColor: 'rgba(99,102,241,0.07)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          {/* Left: Identity */}
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)' }}>
                <Shield size={18} style={{ color: '#FACC15' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.625rem', color: '#93C5FD', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>SENTINEL AI · DAILY BRIEFING</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Good {liveTime.getHours() < 12 ? 'Morning' : 'Afternoon'}, {currentUser?.name?.split(' ')[1] || 'Officer'}.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.6875rem', color: '#FFF', opacity: 0.6 }}>🕐 Last updated {liveTime.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Center: Stats */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '✔', label: 'FIRs Analyzed', value: '1,000' },
              { icon: '✔', label: 'Entities', value: '14,200' },
              { icon: '✔', label: 'Evidence Logs', value: '324' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '0.625rem', color: '#93C5FD', marginBottom: '0.25rem' }}>{s.icon} {s.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Right: Today's Intel */}
          <div style={{ flex: '0 0 auto', minWidth: '180px' }}>
            <div style={{ fontSize: '0.625rem', color: '#93C5FD', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>TODAY'S INTELLIGENCE</div>
            {[
              '🔴 2 High Risk Crime Clusters',
              '📈 1 Crime Spike Predicted',
              '🔗 3 Cross-Case Matches',
              '👥 6 Officers Need Review',
            ].map(item => (
              <div key={item} style={{ fontSize: '0.75rem', color: '#E0E7FF', marginBottom: '0.25rem' }}>{item}</div>
            ))}
            <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: '0.5rem', padding: '0.375rem 0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FACC15' }}>🟠 THREAT: ELEVATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: KPI CARDS ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
        {kpiData.map(kpi => {
          let displayValue = kpi.value;
          if (overview?.summaryCards) {
            const matchedCard = overview.summaryCards.find(c => c.label.includes(kpi.label.split(' ')[1]) || c.label.includes(kpi.label));
            if (matchedCard) displayValue = matchedCard.value;
          }
          return (
            <div key={kpi.label} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: `${kpi.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <kpi.icon size={16} style={{ color: kpi.color }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', fontWeight: 600, color: kpi.up === true ? '#10B981' : kpi.up === false ? '#EF4444' : '#94A3B8' }}>
                  {kpi.up === true ? <TrendingUp size={12} /> : kpi.up === false ? <TrendingDown size={12} /> : <Minus size={12} />}
                  {kpi.trend}
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textPrimary, lineHeight: 1 }}>
                {loading ? <div style={{ height: '24px', width: '60px', backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0', borderRadius: '4px', animation: 'pulse 2s infinite' }} /> : displayValue}
              </div>
              <div style={{ fontSize: '0.6875rem', color: textSecondary }}>{kpi.label}</div>
              <Sparkline data={kpi.spark} color={kpi.color} />
            </div>
          );
        })}
      </div>

      {/* ── ROW 3: AI Intelligence Center + Critical Alerts ─────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>

        {/* AI Intelligence Center */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BrainCircuit size={18} style={{ color: '#3B82F6' }} />
              <span style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem' }}>AI Intelligence Center</span>
            </div>
            <span style={{ fontSize: '0.6875rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live Analysis
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {aiDiscoveries.map((d, i) => (
              <div key={d.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', borderRadius: '0.5rem', border: `1px solid ${border}`, alignItems: 'flex-start' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: `${d.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, color: d.color, fontSize: '0.875rem' }}>#{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: textPrimary, fontSize: '0.875rem' }}>{d.title}</span>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: d.color, backgroundColor: `${d.color}18`, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                      {d.confidence}% confidence
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: textSecondary, marginBottom: '0.25rem' }}>Evidence: {d.evidence}</div>
                  <div style={{ fontSize: '0.75rem', color: textSecondary }}>{d.detail}</div>
                </div>
                {d.fir && (
                  <button
                    onClick={() => navigate(`/cases/${d.fir}`)}
                    style={{ fontSize: '0.6875rem', color: '#3B82F6', background: 'none', border: '1px solid #3B82F6', borderRadius: '0.375rem', padding: '0.25rem 0.625rem', cursor: 'pointer', flexShrink: 0, fontWeight: 600 }}
                  >
                    Open →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: '#EF4444' }} />
              <span style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem' }}>Critical Alerts</span>
            </div>
            <span style={{ fontSize: '0.6875rem', backgroundColor: '#EF444418', color: '#EF4444', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>4 Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {criticalAlerts.map(alert => (
              <div key={alert.id} style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#FAFAFA', border: `1px solid ${border}`, borderLeft: `3px solid ${alert.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem' }}>{alert.dot}</span>
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, color: alert.color, letterSpacing: '0.08em' }}>{alert.level}</span>
                  </div>
                  <span style={{ fontSize: '0.625rem', color: textSecondary }}>{alert.time}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: textPrimary }}>{alert.title}</div>
                <div style={{ fontSize: '0.75rem', color: textSecondary, marginTop: '0.125rem' }}>{alert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Crime Forecast + Crime Distribution ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>

        {/* Crime Forecast Chart */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart2 size={18} style={{ color: '#3B82F6' }} />
                Crime Trend Forecast
              </div>
              <div style={{ fontSize: '0.6875rem', color: textSecondary, marginTop: '0.125rem' }}>Actual · Forecast · AI Confidence Interval</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.6875rem' }}>
              <span style={{ color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '2px', display: 'inline-block' }} />Actual</span>
              <span style={{ color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '2px', backgroundColor: '#06B6D4', display: 'inline-block' }} />AI Forecast</span>
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={aiForecastData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridLine} />
                <XAxis dataKey="month" stroke={textSecondary} fontSize={10} />
                <YAxis stroke={textSecondary} fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="actual" name="Actual FIRs" fill="#3B82F6" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
                <Line type="monotone" dataKey="predicted" name="AI Forecast" stroke="#06B6D4" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4, fill: '#06B6D4', stroke: '#FFF', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Distribution */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: '#8B5CF6' }} />
            Crime Distribution
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {crimeCategories.map(c => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: c.color, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: textPrimary }}>{c.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: textPrimary }}>{c.pct}%</span>
                    {c.trend === 'up' && <TrendingUp size={12} style={{ color: '#EF4444' }} />}
                    {c.trend === 'down' && <TrendingDown size={12} style={{ color: '#10B981' }} />}
                    {c.trend === 'flat' && <Minus size={12} style={{ color: '#94A3B8' }} />}
                  </div>
                </div>
                <div style={{ height: '6px', backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', backgroundColor: c.color, borderRadius: '9999px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 5: Interactive Crime Map + Officer Tasks ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>

        {/* Crime Hotspot Map */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={18} style={{ color: '#06B6D4' }} />
              Interactive Crime Heatmap — Bengaluru
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Hotspots', 'Patrols', 'Predicted'].map(l => (
                <span key={l} style={{ fontSize: '0.6rem', padding: '0.125rem 0.5rem', border: `1px solid ${border}`, borderRadius: '9999px', color: textSecondary, cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Map Canvas */}
          <div style={{ position: 'relative', height: '300px', backgroundColor: isDarkMode ? '#0D1627' : '#E8F0FE', borderRadius: '0.5rem', overflow: 'hidden', border: `1px solid ${border}` }}>
            {/* Grid lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
              {[20, 40, 60, 80].map(p => (
                <React.Fragment key={p}>
                  <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke={isDarkMode ? '#3B82F6' : '#1D4ED8'} strokeWidth="1" />
                  <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke={isDarkMode ? '#3B82F6' : '#1D4ED8'} strokeWidth="1" />
                </React.Fragment>
              ))}
            </svg>

            {/* City label */}
            <div style={{ position: 'absolute', top: '0.5rem', left: '0.75rem', fontSize: '0.6875rem', fontWeight: 700, color: isDarkMode ? '#3B82F6' : '#1D4ED8', opacity: 0.6 }}>BENGALURU METROPOLITAN ZONE</div>

            {/* Hotspot Circles */}
            {hotspotZones.map(z => (
              <div key={z.name} style={{ position: 'absolute', left: `${z.x}%`, top: `${z.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div style={{
                  width: z.risk === 'HIGH' ? '3.5rem' : z.risk === 'MEDIUM' ? '2.5rem' : '1.75rem',
                  height: z.risk === 'HIGH' ? '3.5rem' : z.risk === 'MEDIUM' ? '2.5rem' : '1.75rem',
                  borderRadius: '50%',
                  backgroundColor: z.risk === 'HIGH' ? 'rgba(239,68,68,0.25)' : z.risk === 'MEDIUM' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.15)',
                  border: `2px solid ${z.risk === 'HIGH' ? '#EF4444' : z.risk === 'MEDIUM' ? '#F59E0B' : '#10B981'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: z.risk === 'HIGH' ? 'pulse 2s infinite' : undefined,
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 800, color: z.risk === 'HIGH' ? '#EF4444' : z.risk === 'MEDIUM' ? '#F59E0B' : '#10B981' }}>{z.crimes}</span>
                </div>
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.25rem', fontSize: '0.5625rem', whiteSpace: 'nowrap', color: isDarkMode ? '#94A3B8' : '#475569', fontWeight: 600 }}>{z.name}</div>
              </div>
            ))}

            {/* AI Recommendation overlay */}
            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem', backgroundColor: isDarkMode ? 'rgba(11,17,32,0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', border: `1px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: '0.75rem', color: textPrimary }}>
                <span style={{ fontWeight: 700, color: '#10B981' }}>🧠 AI:</span> Deploy 2 patrols → Electronic City · <span style={{ color: '#10B981', fontWeight: 700 }}>92% confidence</span>
              </div>
              <button style={{ fontSize: '0.6875rem', padding: '0.25rem 0.75rem', backgroundColor: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>Execute</button>
            </div>
          </div>
        </div>

        {/* Officer Task Panel */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} style={{ color: '#10B981' }} />
            Officer Task Center
          </div>
          <div style={{ fontSize: '0.625rem', color: textSecondary, fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.08em' }}>ASSIGNED TO YOU</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {officerTasks.map((t, i) => (
              <div key={i} style={{ padding: '0.625rem 0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', border: `1px solid ${border}`, borderLeft: `3px solid ${t.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textPrimary }}>{t.task}</div>
                  <div style={{ fontSize: '0.625rem', color: textSecondary }}>{t.fir} · {t.due}</div>
                </div>
                <span style={{ fontSize: '0.5625rem', padding: '0.125rem 0.375rem', backgroundColor: `${t.color}18`, color: t.color, borderRadius: '9999px', fontWeight: 700 }}>{t.priority}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#3B82F6', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.08em' }}>🧠 AI SUGGESTED</div>
          <div style={{ padding: '0.625rem 0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#EFF6FF', border: `1px solid #BFDBFE` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8' }}>Investigate FIR-832</div>
            <div style={{ fontSize: '0.625rem', color: '#3B82F6', marginTop: '0.125rem' }}>Cross-links with your active case FIR-089</div>
          </div>
        </div>
      </div>

      {/* ── ROW 6: AI Recommendations + Recent Investigations + Live Feed ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '1.25rem' }}>

        {/* AI Recommendations */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} style={{ color: '#8B5CF6' }} />
            AI Recommendations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {aiRecommendations.map((r, i) => (
              <div key={i} style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', border: `1px solid ${border}`, borderTop: `2px solid ${r.color}` }}>
                <div style={{ fontWeight: 800, color: textPrimary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{r.action}</div>
                <div style={{ fontSize: '0.75rem', color: textSecondary, marginBottom: '0.5rem' }}>{r.detail}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.625rem', color: r.color, fontWeight: 700 }}>{r.confidence}% confidence</span>
                  <button style={{ fontSize: '0.625rem', padding: '0.25rem 0.625rem', backgroundColor: r.color, color: '#FFF', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 700 }}>Execute</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Investigations */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderOpen size={18} style={{ color: '#F59E0B' }} />
              Recent Investigations
            </div>
            <button onClick={() => navigate('/cases')} style={{ fontSize: '0.6875rem', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {(overview?.recentCases || recentInvestigations).map(inv => (
              <div key={inv.fir || inv.id} onClick={() => navigate(`/cases/${inv.fir || inv.caseNumber || inv.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', border: `1px solid ${border}`, cursor: 'pointer', transition: 'background 0.15s' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', backgroundColor: `${inv.statusColor || '#3B82F6'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FolderOpen size={14} style={{ color: inv.statusColor || '#3B82F6' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inv.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: textSecondary }}>{inv.fir || inv.caseNumber || `ID: ${inv.id}`} · {inv.officer || 'Unassigned'}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: inv.statusColor || '#3B82F6', backgroundColor: `${inv.statusColor || '#3B82F6'}18`, padding: '0.125rem 0.5rem', borderRadius: '9999px', marginBottom: '0.25rem' }}>{inv.status}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981' }}>AI {inv.aiScore || (Math.floor(Math.random() * 20) + 80)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Intelligence Feed */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={18} style={{ color: '#10B981' }} />
              Live Feed
            </div>
            <span style={{ fontSize: '0.625rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '5px', height: '5px', backgroundColor: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
              Live
            </span>
          </div>
          <div ref={feedRef} style={{ height: '260px', overflowY: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.6875rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', scrollbarWidth: 'none' }}>
            {feedItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.375rem 0', borderBottom: `1px solid ${border}` }}>
                <span style={{ color: textSecondary, flexShrink: 0, fontWeight: 500 }}>{item.time}</span>
                <span style={{ padding: '0.0625rem 0.375rem', backgroundColor: `${feedColors[item.type] || '#3B82F6'}22`, color: feedColors[item.type] || '#3B82F6', borderRadius: '0.25rem', fontWeight: 700, fontSize: '0.5625rem', flexShrink: 0 }}>{item.type}</span>
                <span style={{ color: textPrimary, lineHeight: 1.4 }}>{item.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 7: Officer Performance + Deadlines + System Health ─────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px 260px', gap: '1.25rem' }}>

        {/* Officer Performance */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} style={{ color: '#6366F1' }} />
            Officer Performance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {officerPerformance.map((o, i) => (
              <div key={o.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', border: `1px solid ${border}` }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: `${['#3B82F6','#8B5CF6','#06B6D4','#10B981'][i]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: ['#3B82F6','#8B5CF6','#06B6D4','#10B981'][i], fontSize: '0.75rem', flexShrink: 0 }}>
                  {o.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.8125rem' }}>{o.name}</div>
                  <div style={{ fontSize: '0.625rem', color: textSecondary }}>{o.solved}/{o.cases} cases · Load: {o.load}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: textPrimary }}>{o.efficiency}%</div>
                  <div style={{ fontSize: '0.625rem', color: '#10B981' }}>AI {o.aiScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: '#F59E0B' }} />
            Upcoming Deadlines
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {upcomingDeadlines.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2px', backgroundColor: d.urgency === 'high' ? '#EF4444' : d.urgency === 'medium' ? '#F59E0B' : '#10B981', borderRadius: '9999px', flexShrink: 0, alignSelf: 'stretch', minHeight: '2.5rem' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: textPrimary, fontSize: '0.8125rem' }}>{d.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: d.urgency === 'high' ? '#EF4444' : textSecondary, marginTop: '0.125rem', fontWeight: d.urgency === 'high' ? 700 : 400 }}>{d.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} style={{ color: '#06B6D4' }} />
            System Health
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
            {[
              { label: 'AI Engine', status: 'Healthy', icon: BrainCircuit, color: '#10B981' },
              { label: 'Database', status: 'Healthy', icon: Database, color: '#10B981' },
              { label: 'API Latency', status: '24 ms', icon: Wifi, color: '#3B82F6' },
              { label: 'Embeddings', status: '14,200', icon: Cpu, color: '#8B5CF6' },
              { label: 'Knowledge Graph', status: 'Operational', icon: Activity, color: '#10B981' },
              { label: 'Last Sync', status: '12 sec ago', icon: RefreshCw, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.375rem 0', borderBottom: `1px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: textSecondary }}>
                  <s.icon size={12} style={{ color: s.color }} />
                  {s.label}
                </div>
                <span style={{ fontWeight: 700, color: s.color, fontSize: '0.6875rem' }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOATING AI BUTTON ──────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        {showAIChat && (
          <div style={{ position: 'absolute', bottom: '4rem', right: 0, width: '260px', backgroundColor: card, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ fontWeight: 700, color: textPrimary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>🧠 Ask Sentinel AI</div>
            <input placeholder="What would you like to investigate?" style={{ width: '100%', padding: '0.5rem', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC', border: `1px solid ${border}`, borderRadius: '0.375rem', color: textPrimary, fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />
            <button onClick={() => navigate('/ai-assistant')} style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', backgroundColor: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Open AI Copilot →</button>
          </div>
        )}
        <button
          onClick={() => setShowAIChat(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1E3A8A', color: '#FFF', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '2rem', padding: '0.75rem 1.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 8px 24px rgba(30,58,138,0.5)', transition: 'all 0.2s' }}
        >
          <BrainCircuit size={18} />
          Ask Sentinel
        </button>
      </div>

    </div>
  );
};
