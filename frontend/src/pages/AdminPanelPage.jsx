import React, { useState } from 'react';
import { mockUsers, mockAuditLogs, mockSystemHealth } from '../mockData/mockAuditLogs';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  Users,
  Activity,
  Cpu,
  Lock,
  Database,
  Server,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131B2E] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck size={22} className="text-blue-400" />
            <span>Admin Control Panel & System Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage personnel RBAC permissions, review immutable audit logs, & monitor node system health.
          </p>
        </div>
        <Badge variant="danger" size="md">
          ADMIN CLEARANCE ONLY
        </Badge>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#131B2E] border border-slate-800 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Activity size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">API Gateway Latency</span>
            <p className="text-base font-bold text-slate-100">{mockSystemHealth.apiLatency}</p>
          </div>
        </div>

        <div className="p-4 bg-[#131B2E] border border-slate-800 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
            <Cpu size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">AI Intelligence Core</span>
            <p className="text-xs font-bold text-emerald-400 truncate">{mockSystemHealth.aiModelStatus.split(' ')[0]}</p>
          </div>
        </div>

        <div className="p-4 bg-[#131B2E] border border-slate-800 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
            <Database size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Vector Embeddings</span>
            <p className="text-xs font-bold text-slate-100">{mockSystemHealth.vectorDbDocs}</p>
          </div>
        </div>

        <div className="p-4 bg-[#131B2E] border border-slate-800 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Server size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Node Load / CPU</span>
            <p className="text-base font-bold text-slate-100">{mockSystemHealth.serverLoad}</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'users' ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={16} />
          <span>User & RBAC Management</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'audit' ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock size={16} />
          <span>Immutable Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'rbac' ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Permission Matrix</span>
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Authorized Police Personnel ({mockUsers.length})</h3>
            <button
              onClick={() => alert("Provision New Officer SmartCard modal opened.")}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Provision User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0E1525] border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-4 py-3">Officer Name</th>
                  <th className="px-4 py-3">Gov Email</th>
                  <th className="px-4 py-3">Clearance Role</th>
                  <th className="px-4 py-3">Station Unit</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-slate-100">{u.name}</td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'Admin' ? 'danger' : u.role === 'Supervisor' ? 'warning' : 'primary'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{u.station}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{u.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Security Audit Trail (IP & Cryptographic Signature Logged)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0E1525] border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-4 py-3">Log ID</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User & Role</th>
                  <th className="px-4 py-3">Action Event</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 font-mono">
                    <td className="px-4 py-3 font-bold text-blue-400">{log.id}</td>
                    <td className="px-4 py-3 text-slate-400">{log.timestamp}</td>
                    <td className="px-4 py-3 text-slate-100">{log.user} ({log.role})</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">{log.action}</td>
                    <td className="px-4 py-3 text-slate-400">{log.ip}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: RBAC Permission Matrix */}
      {activeTab === 'rbac' && (
        <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Role-Based Access Control (RBAC) Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0E1525] border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-4 py-3">Permission Feature</th>
                  <th className="px-4 py-3 text-center">Investigator</th>
                  <th className="px-4 py-3 text-center">Analyst</th>
                  <th className="px-4 py-3 text-center">Supervisor</th>
                  <th className="px-4 py-3 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { feature: 'View FIR Directory & Case Details', inv: true, ana: true, sup: true, adm: true },
                  { feature: 'Run AI Crime Intelligence Queries', inv: true, ana: true, sup: true, adm: true },
                  { feature: 'Modify Criminal Link Network Graph', inv: false, ana: true, sup: true, adm: true },
                  { feature: 'Approve PDF Report Export', inv: false, ana: false, sup: true, adm: true },
                  { feature: 'User Provisioning & Role Revocation', inv: false, ana: false, sup: false, adm: true }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-slate-100">{row.feature}</td>
                    <td className="px-4 py-3 text-center">{row.inv ? <CheckCircle2 size={16} className="mx-auto text-emerald-400" /> : <AlertCircle size={16} className="mx-auto text-slate-600" />}</td>
                    <td className="px-4 py-3 text-center">{row.ana ? <CheckCircle2 size={16} className="mx-auto text-emerald-400" /> : <AlertCircle size={16} className="mx-auto text-slate-600" />}</td>
                    <td className="px-4 py-3 text-center">{row.sup ? <CheckCircle2 size={16} className="mx-auto text-emerald-400" /> : <AlertCircle size={16} className="mx-auto text-slate-600" />}</td>
                    <td className="px-4 py-3 text-center">{row.adm ? <CheckCircle2 size={16} className="mx-auto text-emerald-400" /> : <AlertCircle size={16} className="mx-auto text-slate-600" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
