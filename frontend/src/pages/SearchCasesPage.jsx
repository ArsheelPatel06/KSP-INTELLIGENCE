import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search, Plus, Download, RefreshCw, SlidersHorizontal, Bot, Sparkles,
  Eye, Network, FileText, Clock, UserCheck, ChevronRight,
  AlertTriangle, XCircle, Timer, Archive,
  Filter, X, TrendingUp, Users, Car, MapPin, Phone, CreditCard,
  MoreHorizontal, Zap, Star, Shield, Layers, FileBarChart,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, User
} from 'lucide-react';

// ─── Global Design System ─────────────────────────────────────────────────────
import { Btn, BtnIcon, RowAction, FilterChip, BulkBtn } from '../components/common/ButtonSystem';

// ─── Status / Priority config ─────────────────────────────────────────────────
const STATUS_CONFIG = {
  'Open':                { color: 'text-blue-700 bg-blue-50 border-blue-200',    dot: 'bg-blue-500' },
  'Under Investigation': { color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  'Charge Sheet Filed':  { color: 'text-purple-700 bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  'Solved':              { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  'Pending Forensic':    { color: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-400' },
};

const PRIORITY_CONFIG = {
  Critical: 'bg-red-500', High: 'bg-orange-500', Medium: 'bg-yellow-400', Low: 'bg-slate-300',
};

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarColors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-indigo-500'];
const getAvatarColor = (name = '') => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials    = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

// ─── Smart filter chips ───────────────────────────────────────────────────────
const SMART_FILTERS = [
  { label: 'High Risk',      icon: Shield },
  { label: 'Pending Review', icon: Timer },
  { label: 'AI Suggested',   icon: Sparkles },
  { label: 'Today',          icon: Clock },
  { label: 'My Cases',       icon: UserCheck },
  { label: 'No Officer',     icon: XCircle },
  { label: 'Cold Cases',     icon: Archive },
];

// ─── AI Suggestion cards ──────────────────────────────────────────────────────
const AI_SUGGESTIONS = [
  { icon: AlertTriangle, color: 'text-red-500',     bg: 'bg-red-50',     label: 'Review FIR-089',        sub: 'High risk pattern detected' },
  { icon: Layers,        color: 'text-purple-600',  bg: 'bg-purple-50',  label: 'Merge FIR-102 & 117',   sub: 'Same suspect fingerprint' },
  { icon: Car,           color: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Vehicle Pattern Found',  sub: '3 FIRs share KA01MX series' },
  { icon: CreditCard,    color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Financial Link',         sub: 'Shared account across 5 cases' },
  { icon: User,          color: 'text-amber-600',   bg: 'bg-amber-50',   label: 'Same Suspect Found',     sub: 'Ramesh Shetty in 4 open FIRs' },
];

// ─── Preview Drawer ───────────────────────────────────────────────────────────
const DRAWER_TABS = ['Overview','Timeline','Evidence','Suspects','AI Summary','Related'];

const PreviewDrawer = ({ fir, onClose, onOpenFull }) => {
  const [drawerTab, setDrawerTab] = useState('Overview');
  if (!fir) return null;
  const statusCfg = STATUS_CONFIG[fir.status] || STATUS_CONFIG['Open'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[fir.priority] || 'bg-slate-400'}`} />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{fir.priority} Priority</span>
            </div>
            <h2 className="text-[20px] font-extrabold text-slate-900">{fir.firNumber}</h2>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">{fir.crimeType} · {fir.district}</p>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="primary" size="sm" icon={ChevronRight} iconRight onClick={onOpenFull}>Open Full</Btn>
            <BtnIcon icon={X} variant="ghost" onClick={onClose} title="Close" />
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="flex border-b border-gray-100 px-3 overflow-x-auto scrollbar-hide shrink-0">
          {DRAWER_TABS.map(t => (
            <button
              key={t}
              onClick={() => setDrawerTab(t)}
              className={`px-3 py-3 text-[12px] font-bold whitespace-nowrap border-b-2 transition-all ${
                drawerTab === t ? 'text-blue-600 border-blue-500' : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {drawerTab === 'Overview' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Status', value: <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusCfg.color}`}><span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}/>{fir.status}</span> },
                  { label: 'AI Confidence', value: <span className="font-extrabold text-blue-600 text-[15px]">{fir.confidenceScore}%</span> },
                  { label: 'Incident Date',  value: fir.incidentDate },
                  { label: 'Police Station', value: fir.policeStation },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-[12px] bg-slate-50 border border-gray-100">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</div>
                    <div className="text-[13px] font-semibold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>

              {fir.assignedOfficer && (
                <div className="flex items-center gap-3 p-3 rounded-[12px] bg-blue-50 border border-blue-100">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0 ${getAvatarColor(fir.assignedOfficer.name)}`}>
                    {getInitials(fir.assignedOfficer.name)}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">{fir.assignedOfficer.name}</div>
                    <div className="text-[11px] text-blue-600 font-medium">{fir.assignedOfficer.rank}</div>
                  </div>
                </div>
              )}

              {fir.suspects?.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Suspects</div>
                  <div className="space-y-2">
                    {fir.suspects.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-[10px] bg-white border border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><User size={13} /></div>
                        <div>
                          <div className="text-[12px] font-bold text-slate-800">{s.name}</div>
                          {s.knownAlias && <div className="text-[10px] text-slate-400">Alias: {s.knownAlias}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {drawerTab === 'Timeline' && (
            <div className="relative ml-3 border-l-2 border-blue-100 pb-4">
              {[
                { date: fir.incidentDate, label: 'Incident Reported', detail: `FIR registered at ${fir.policeStation}` },
                { date: 'Day 3', label: 'Initial Evidence Collected', detail: 'CCTV footage and witness statements' },
                { date: 'Day 7', label: 'Suspect Identified', detail: fir.suspects?.[0]?.name || 'Under investigation' },
              ].map((e, i) => (
                <div key={i} className="relative pl-5 pb-5">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">{e.date}</div>
                  <div className="text-[13px] font-bold text-slate-800">{e.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{e.detail}</div>
                </div>
              ))}
            </div>
          )}

          {drawerTab === 'AI Summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-[14px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Bot size={16} className="text-blue-600" />
                  <span className="text-[12px] font-bold text-blue-700 uppercase tracking-widest">AI Analysis</span>
                </div>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  This case exhibits a <strong>{fir.confidenceScore}% confidence</strong> pattern match with known {fir.crimeType} networks in the {fir.district} region. Recommended priority: <strong>{fir.priority}</strong>.
                </p>
              </div>
              <div className="p-3 rounded-[12px] bg-emerald-50 border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-2">AI Recommendation</div>
                <p className="text-[12px] text-slate-700 font-medium">Cross-reference with FIR-2026-0089 and run a vehicle trace on all registered plates for the primary suspect.</p>
              </div>
            </div>
          )}

          {['Evidence','Suspects','Related'].includes(drawerTab) && (
            <div className="text-center py-8 text-slate-400 text-[13px] font-medium">
              No {drawerTab.toLowerCase()} data to preview.
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-2 bg-white shrink-0">
          <Btn variant="secondary" className="flex-1">Assign Officer</Btn>
          <Btn variant="primary" className="flex-1" onClick={onOpenFull}>Open Investigation</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ col, sortCol, sortDir }) => {
  if (sortCol !== col) return <ArrowUpDown size={12} className="text-slate-300" />;
  return sortDir === 'asc' ? <ArrowUp size={12} className="text-blue-500" /> : <ArrowDown size={12} className="text-blue-500" />;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const SearchCasesPage = () => {
  const { firs } = useApp();
  const navigate = useNavigate();

  const [search, setSearch]           = useState('');
  const [districtFilter, setDistrict] = useState('All');
  const [statusFilter, setStatus]     = useState('All');
  const [crimeFilter, setCrime]       = useState('All');
  const [priorityFilter, setPriority] = useState('All');
  const [smartFilter, setSmartFilter] = useState(null);
  const [sortCol, setSortCol]         = useState('priority');
  const [sortDir, setSortDir]         = useState('asc');
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(25);
  const [selected, setSelected]       = useState(new Set());
  const [previewFir, setPreviewFir]   = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredFirs = useMemo(() => {
    let data = [...firs];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(f =>
        f.firNumber?.toLowerCase().includes(q) ||
        f.crimeType?.toLowerCase().includes(q) ||
        f.district?.toLowerCase().includes(q) ||
        f.policeStation?.toLowerCase().includes(q) ||
        f.assignedOfficer?.name?.toLowerCase().includes(q) ||
        f.suspects?.some(s => s.name?.toLowerCase().includes(q))
      );
    }
    if (districtFilter !== 'All') data = data.filter(f => f.district === districtFilter);
    if (statusFilter   !== 'All') data = data.filter(f => f.status === statusFilter);
    if (crimeFilter    !== 'All') data = data.filter(f => f.crimeType === crimeFilter);
    if (priorityFilter !== 'All') data = data.filter(f => f.priority === priorityFilter);

    // Smart Filter Logic
    if (smartFilter) {
      if (smartFilter === 'High Risk') {
        data = data.filter(f => ['Critical', 'High'].includes(f.priority));
      } else if (smartFilter === 'Pending Review') {
        data = data.filter(f => f.status === 'Pending Review');
      } else if (smartFilter === 'AI Suggested') {
        data = data.filter(f => f.confidenceScore >= 85);
      } else if (smartFilter === 'My Cases') {
        data = data.filter(f => f.assignedOfficer?.name?.includes('Rathore'));
      } else if (smartFilter === 'No Officer') {
        data = data.filter(f => !f.assignedOfficer);
      } else if (smartFilter === 'Cold Cases') {
        data = data.filter(f => ['Closed', 'Cold'].includes(f.status));
      } else if (smartFilter === 'Today') {
        data = data.filter(f => f.incidentDate?.includes('Today'));
      }
    }

    data.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (sortCol === 'priority')         { va = PRIORITY_ORDER[a.priority];   vb = PRIORITY_ORDER[b.priority]; }
      if (sortCol === 'confidenceScore')  { va = Number(a.confidenceScore);    vb = Number(b.confidenceScore); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
    return data;
  }, [firs, search, districtFilter, statusFilter, crimeFilter, priorityFilter, smartFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredFirs.length / pageSize);
  const paginated  = filteredFirs.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  };

  const toggleSelect    = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(f => f.id)));

  const resetFilters = () => {
    setDistrict('All'); setStatus('All'); setCrime('All');
    setPriority('All'); setSmartFilter(null); setSearch(''); setPage(1);
  };

  const distinctDistricts = ['All', ...new Set(firs.map(f => f.district))];
  const distinctStatuses  = ['All', ...new Set(firs.map(f => f.status))];
  const distinctCrimes    = ['All', ...new Set(firs.map(f => f.crimeType))];

  const kpis = [
    { label: 'Total FIRs',      value: firs.length.toLocaleString(), icon: FileText,      color: 'text-slate-600' },
    { label: 'Active',          value: firs.filter(f => ['Under Investigation','Open'].includes(f.status)).length, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'High Risk',       value: firs.filter(f => ['Critical','High'].includes(f.priority)).length, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'AI Matches',      value: firs.filter(f => f.confidenceScore >= 85).length, icon: Bot, color: 'text-indigo-600' },
    { label: "Today's Priority",value: 6, icon: Star, color: 'text-amber-500' },
  ];

  const hasActiveFilters = districtFilter !== 'All' || statusFilter !== 'All' || crimeFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[28px] font-extrabold text-slate-900 leading-tight">Investigation Center</h1>
            <p className="text-[14px] text-slate-500 font-medium mt-0.5">Find, filter, prioritize, and open cases in seconds.</p>
          </div>
          {/* KPI strip */}
          <div className="flex items-center gap-5 flex-wrap">
            {kpis.map((k, i) => (
              <div key={k.label} className="flex items-center gap-2">
                <k.icon size={15} className={k.color} />
                <div>
                  <div className={`text-[18px] font-extrabold ${k.color} leading-none`}>{k.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{k.label}</div>
                </div>
                {i < kpis.length - 1 && <div className="w-px h-7 bg-gray-200 ml-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMMAND BAR ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm px-5 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[260px] relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search FIR, person, vehicle, phone, IMEI, officer..."
              className="w-full h-10 pl-9 pr-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[13px] font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all"
            />
          </div>

          {/* Filter toggle */}
          <Btn
            variant={showFilters || hasActiveFilters ? 'primary' : 'secondary'}
            size="md"
            icon={SlidersHorizontal}
            onClick={() => setShowFilters(v => !v)}
          >
            Filters {hasActiveFilters && '·'}
          </Btn>

          <div className="flex-1 hidden md:block" />

          {/* Action bar — correct hierarchy */}
          <Btn variant="primary" size="md" icon={Plus} onClick={() => alert('Opening New FIR Flow...')}>New FIR</Btn>
          <Btn variant="ai" size="md" icon={Sparkles} onClick={() => alert('Running AI Prioritization Model...')}>AI Prioritize</Btn>
          <Btn variant="secondary" size="md" icon={Download} onClick={() => alert('Exporting Report to PDF...')}>Export</Btn>
          <BtnIcon icon={RefreshCw} variant="ghost" title="Reset Filters" onClick={resetFilters} />
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'District',   value: districtFilter, setter: (v) => { setDistrict(v); setPage(1); }, options: distinctDistricts },
              { label: 'Status',     value: statusFilter,   setter: (v) => { setStatus(v);   setPage(1); }, options: distinctStatuses },
              { label: 'Crime Type', value: crimeFilter,    setter: (v) => { setCrime(v);    setPage(1); }, options: distinctCrimes },
              { label: 'Priority',   value: priorityFilter, setter: (v) => { setPriority(v); setPage(1); }, options: ['All','Critical','High','Medium','Low'] },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{f.label}</label>
                <select
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full h-9 px-3 rounded-[12px] border border-gray-200 bg-slate-50 text-[12px] font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-colors appearance-none"
                >
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SMART CHIPS + AI SUGGESTION CARDS ────────────────────────────── */}
      <div className="flex items-start gap-3 flex-wrap">
        {/* Smart filter chips */}
        <div className="flex gap-2 flex-wrap">
          {SMART_FILTERS.map(sf => (
            <FilterChip
              key={sf.label}
              icon={sf.icon}
              active={smartFilter === sf.label}
              onClick={() => setSmartFilter(s => s === sf.label ? null : sf.label)}
            >
              {sf.label}
            </FilterChip>
          ))}
        </div>

        {/* AI suggestion cards — NOT buttons, they're cards */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 ml-auto">
          {AI_SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              onClick={() => alert(`Executing AI Action: ${s.label}`)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] bg-white border border-gray-200 hover:border-blue-200 hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] cursor-pointer transition-all group shrink-0"
            >
              <div className={`w-7 h-7 rounded-[8px] ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon size={14} className={s.color} />
              </div>
              <div>
                <div className="text-[12px] font-bold text-slate-800 group-hover:text-blue-700 whitespace-nowrap">{s.label}</div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap">{s.sub}</div>
              </div>
              <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-400 ml-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── BULK ACTION TOOLBAR ───────────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-[14px] bg-blue-600 text-white shadow-lg">
          <span className="text-[13px] font-bold shrink-0">{selected.size} selected</span>
          <div className="flex gap-2 flex-wrap">
            {['Assign', 'Export', 'Generate Report', 'Close', 'Merge'].map(a => (
              <BulkBtn key={a}>{a}</BulkBtn>
            ))}
          </div>
          <button className="ml-auto p-1.5 rounded-lg hover:bg-white/20 transition-colors shrink-0" onClick={() => setSelected(new Set())}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── TABLE ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm overflow-hidden">

        {/* Table meta row */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-[13px] font-bold text-slate-400">
            {filteredFirs.length === 0
              ? 'No cases found'
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredFirs.length)} of ${filteredFirs.length} cases`
            }
          </span>
          <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
            <span className="font-medium mr-1">Rows</span>
            {[25, 50, 100].map(n => (
              <button
                key={n}
                onClick={() => { setPageSize(n); setPage(1); }}
                className={`px-2.5 py-1 rounded-[8px] font-bold transition-colors ${pageSize === n ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="pl-5 pr-3 py-3 w-10">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleSelectAll} />
                </th>
                {[
                  { label: '',          col: null },
                  { label: 'FIR',       col: 'firNumber' },
                  { label: 'Crime',     col: 'crimeType' },
                  { label: 'Officer',   col: null },
                  { label: 'District',  col: 'district' },
                  { label: 'Status',    col: 'status' },
                  { label: 'Priority',  col: 'priority' },
                  { label: 'AI Risk',   col: 'confidenceScore' },
                  { label: 'Updated',   col: 'incidentDate' },
                  { label: '',          col: null },
                ].map(({ label, col }, i) => (
                  <th
                    key={i}
                    onClick={() => col && toggleSort(col)}
                    className={`px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-slate-400 whitespace-nowrap ${col ? 'cursor-pointer hover:text-slate-600 select-none' : ''}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {label} {col && <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Search size={28} />
                      <div className="text-[15px] font-bold text-slate-600">No FIRs Found</div>
                      <p className="text-[13px]">Try removing filters or searching another district</p>
                      <Btn variant="primary" size="sm" onClick={resetFilters}>Reset Filters</Btn>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((fir) => {
                const statusCfg = STATUS_CONFIG[fir.status] || STATUS_CONFIG['Open'];
                const isSelected = selected.has(fir.id);
                const riskColor = fir.confidenceScore >= 85 ? 'text-blue-600' : fir.confidenceScore >= 60 ? 'text-amber-600' : 'text-slate-500';

                return (
                  <tr
                    key={fir.id}
                    className={`group hover:bg-blue-50/30 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`}
                    onClick={() => setPreviewFir(fir)}
                  >
                    <td className="pl-5 pr-3 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                        checked={isSelected} onChange={() => toggleSelect(fir.id)} />
                    </td>
                    <td className="px-2 py-4">
                      <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[fir.priority] || 'bg-slate-300'}`} />
                    </td>
                    <td className="px-3 py-4">
                      <span className="font-extrabold text-blue-600 text-[14px]">{fir.firNumber}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-[13px] font-semibold text-slate-700 max-w-[150px] truncate block">{fir.crimeType}</span>
                    </td>
                    <td className="px-3 py-4">
                      {fir.assignedOfficer ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${getAvatarColor(fir.assignedOfficer.name)}`}>
                            {getInitials(fir.assignedOfficer.name)}
                          </div>
                          <span className="text-[12px] font-semibold text-slate-600 max-w-[110px] truncate">{fir.assignedOfficer.name}</span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-[12px] font-medium text-slate-600 truncate max-w-[110px] block">{fir.district}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold whitespace-nowrap ${statusCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{fir.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`text-[11px] font-extrabold uppercase tracking-wide ${
                        fir.priority === 'Critical' ? 'text-red-600' :
                        fir.priority === 'High'     ? 'text-orange-600' :
                        fir.priority === 'Medium'   ? 'text-yellow-600' : 'text-slate-400'
                      }`}>{fir.priority}</span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={12} className="text-indigo-400 shrink-0" />
                        <span className={`text-[13px] font-extrabold ${riskColor}`}>{fir.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-[12px] text-slate-400 font-medium">{fir.incidentDate}</span>
                    </td>
                    {/* Row hover actions — icon-only, revealed on hover */}
                    <td className="pr-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <RowAction icon={Eye}         title="Quick Preview"    colorClass="text-blue-600 bg-blue-50 hover:bg-blue-100" onClick={() => setPreviewFir(fir)} />
                        <RowAction icon={ChevronRight} title="Open Full"       colorClass="text-slate-500 hover:bg-slate-100 hover:text-slate-700" onClick={() => navigate(`/cases/${fir.id}`)} />
                        <RowAction icon={Network}     title="View Network"     colorClass="text-slate-500 hover:bg-slate-100 hover:text-slate-700" onClick={() => navigate('/network')} />
                        <RowAction icon={MoreHorizontal} title="More actions"  colorClass="text-slate-500 hover:bg-slate-100 hover:text-slate-700" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-[12px] text-slate-500 font-medium">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              <BtnIcon icon={ChevronLeft} variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} />
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pg = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-9 h-9 rounded-[10px] text-[13px] font-bold transition-colors ${pg === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-slate-500 hover:bg-slate-50'}`}
                  >{pg}</button>
                );
              })}
              <BtnIcon icon={ChevronRight} variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
            </div>
          </div>
        )}
      </div>

      {/* Preview Drawer */}
      {previewFir && (
        <PreviewDrawer fir={previewFir} onClose={() => setPreviewFir(null)} onOpenFull={() => navigate(`/cases/${previewFir.id}`)} />
      )}
    </div>
  );
};
