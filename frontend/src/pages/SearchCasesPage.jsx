import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Eye, RefreshCw, Network } from 'lucide-react';

export const SearchCasesPage = () => {
  const { firs } = useApp();
  const navigate = useNavigate();

  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredFirs = firs.filter((fir) => {
    if (districtFilter !== 'All' && fir.district !== districtFilter) return false;
    if (statusFilter !== 'All' && fir.status !== statusFilter) return false;
    if (crimeTypeFilter !== 'All' && fir.crimeType !== crimeTypeFilter) return false;
    if (priorityFilter !== 'All' && fir.priority !== priorityFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'FIR Number',
      accessor: 'firNumber',
      render: (row) => (
        <span className="font-extrabold text-blue-500 hover:underline cursor-pointer" onClick={() => navigate(`/cases/${row.id}`)}>
          {row.firNumber}
        </span>
      )
    },
    { header: 'Crime Category', accessor: 'crimeType' },
    { header: 'District', accessor: 'district' },
    { header: 'Police Station', accessor: 'policeStation' },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <Badge variant={row.priority === 'Critical' ? 'danger' : row.priority === 'High' ? 'warning' : 'primary'} size="sm">
          {row.priority}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span style={{
          padding: '0.125rem 0.5rem',
          fontSize: '0.625rem',
          fontWeight: 700,
          borderRadius: '0.25rem',
          backgroundColor: row.status === 'Solved' ? '#D1FAE5' : row.status === 'Under Investigation' ? '#FEF3C7' : 'var(--t-bg-card-alt)',
          color: row.status === 'Solved' ? '#065F46' : row.status === 'Under Investigation' ? '#92400E' : 'var(--t-text-secondary)',
          border: '1px solid',
          borderColor: row.status === 'Solved' ? '#6EE7B7' : row.status === 'Under Investigation' ? '#FCD34D' : 'var(--t-border)',
        }}>
          {row.status}
        </span>
      )
    },
    { header: 'Incident Date', accessor: 'incidentDate' },
    {
      header: 'AI Confidence',
      accessor: 'confidenceScore',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#06B6D4' }}>
          {row.confidenceScore}% Match
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button
            onClick={() => navigate(`/cases/${row.id}`)}
            style={{ padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer' }}
            title="Inspect FIR Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => navigate('/network')}
            style={{ padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'var(--t-bg-card-alt)', color: 'var(--t-text-secondary)', border: '1px solid var(--t-border)', cursor: 'pointer' }}
            title="Link Graph"
          >
            <Network size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0' }}>
      {/* Header */}
      <div className="t-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderRadius: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--t-text-primary)', marginBottom: '0.25rem' }}>
            Crime Case Directory &amp; FIR Search
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--t-text-secondary)' }}>
            Query across <strong style={{ color: 'var(--t-text-primary)' }}>1,000 FIRs</strong>, suspects, victims, and digital evidence logs.
          </p>
        </div>
        <button
          onClick={() => { setDistrictFilter('All'); setStatusFilter('All'); setCrimeTypeFilter('All'); setPriorityFilter('All'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: 'var(--t-bg-card-alt)', color: 'var(--t-text-primary)', border: '1px solid var(--t-border)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
        >
          <RefreshCw size={14} /> Reset Filters
        </button>
      </div>

      {/* Filters */}
      <div className="t-card" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', borderRadius: '0.75rem' }}>
        {[
          { label: 'District Jurisdiction', value: districtFilter, setter: setDistrictFilter, options: ['All', 'Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi'] },
          { label: 'Investigation Status', value: statusFilter, setter: setStatusFilter, options: ['All', 'Under Investigation', 'Solved', 'Charge Sheet Filed', 'Pending Forensic'] },
          { label: 'Offense Classification', value: crimeTypeFilter, setter: setCrimeTypeFilter, options: ['All', 'Cyber Financial Fraud', 'Chain Snatching', 'Armed Robbery', 'Homicide Investigation', 'Narcotics Distribution'] },
          { label: 'Priority Severity', value: priorityFilter, setter: setPriorityFilter, options: ['All', 'Critical', 'High', 'Medium', 'Low'] },
        ].map(f => (
          <div key={f.label}>
            <label className="t-label">{f.label}</label>
            <select value={f.value} onChange={e => f.setter(e.target.value)} className="t-input">
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable data={filteredFirs} columns={columns} pageSize={15} searchPlaceholder="Search by FIR #, Suspect name, Vehicle, or Officer..." />
    </div>
  );
};
