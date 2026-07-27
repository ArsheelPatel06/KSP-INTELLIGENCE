import React, { useState } from 'react';
import { mockUsers, mockAuditLogs, mockSystemHealth } from '../mockData/mockAuditLogs';
import { Badge } from '../components/common/Badge';
import { Btn, BtnIcon } from '../components/common/ButtonSystem';
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
    <div className="flex flex-col gap-5 pb-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-600" />
            <span>Admin Control Panel &amp; System Governance</span>
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Manage personnel RBAC permissions, review immutable audit logs, &amp; monitor node system health.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[12px] font-extrabold tracking-widest uppercase">
          Admin Clearance Only
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">API Gateway Latency</span>
            <p className="text-[16px] font-extrabold text-slate-800">{mockSystemHealth.apiLatency}</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Cpu size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">AI Intelligence Core</span>
            <p className="text-[14px] font-extrabold text-emerald-600 truncate">{mockSystemHealth.aiModelStatus.split(' ')[0]}</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Database size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Vector Embeddings</span>
            <p className="text-[16px] font-extrabold text-slate-800">{mockSystemHealth.vectorDbDocs}</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Server size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Node Load / CPU</span>
            <p className="text-[16px] font-extrabold text-slate-800">{mockSystemHealth.serverLoad}</p>
          </div>
        </div>
      </div>

      {/* Main Container for Tabs & Content */}
      <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm overflow-hidden">
        {/* Main Tabs */}
        <div className="flex border-b border-gray-100 px-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3.5 text-[12px] font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} />
            User &amp; RBAC Management
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-3.5 text-[12px] font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Lock size={14} />
            Immutable Audit Logs
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`flex items-center gap-2 px-4 py-3.5 text-[12px] font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'rbac' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShieldCheck size={14} />
            Permission Matrix
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: User Management */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-extrabold text-slate-800">Authorized Police Personnel ({mockUsers.length})</h3>
                <Btn variant="primary" size="sm" icon={Plus} onClick={() => alert("Provision New Officer SmartCard modal opened.")}>
                  Provision User
                </Btn>
              </div>

              <div className="overflow-x-auto rounded-[12px] border border-gray-200">
                <table className="w-full text-left text-[13px] text-slate-600">
                  <thead className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Officer Name</th>
                      <th className="px-4 py-3">Gov Email</th>
                      <th className="px-4 py-3">Clearance Role</th>
                      <th className="px-4 py-3">Station Unit</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {mockUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-800">{u.name}</td>
                        <td className="px-4 py-3 text-slate-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                            u.role === 'Admin' ? 'bg-red-50 border-red-200 text-red-700' :
                            u.role === 'Supervisor' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{u.station}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-medium">{u.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Audit Logs */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-slate-800">Security Audit Trail (IP &amp; Cryptographic Signature Logged)</h3>
              <div className="overflow-x-auto rounded-[12px] border border-gray-200">
                <table className="w-full text-left text-[13px] text-slate-600">
                  <thead className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Log ID</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">User &amp; Role</th>
                      <th className="px-4 py-3">Action Event</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-blue-600 font-mono text-[12px]">{log.id}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[12px]">{log.timestamp}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{log.user} ({log.role})</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{log.action}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[12px]">{log.ip}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-slate-800">Role-Based Access Control (RBAC) Matrix</h3>
              <div className="overflow-x-auto rounded-[12px] border border-gray-200">
                <table className="w-full text-left text-[13px] text-slate-600">
                  <thead className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Permission Feature</th>
                      <th className="px-4 py-3 text-center">Investigator</th>
                      <th className="px-4 py-3 text-center">Analyst</th>
                      <th className="px-4 py-3 text-center">Supervisor</th>
                      <th className="px-4 py-3 text-center">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {[
                      { feature: 'View FIR Directory & Case Details', inv: true, ana: true, sup: true, adm: true },
                      { feature: 'Run AI Crime Intelligence Queries', inv: true, ana: true, sup: true, adm: true },
                      { feature: 'Modify Criminal Link Network Graph', inv: false, ana: true, sup: true, adm: true },
                      { feature: 'Approve PDF Report Export', inv: false, ana: false, sup: true, adm: true },
                      { feature: 'User Provisioning & Role Revocation', inv: false, ana: false, sup: false, adm: true }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{row.feature}</td>
                        <td className="px-4 py-3 text-center">{row.inv ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <AlertCircle size={18} className="mx-auto text-slate-300" />}</td>
                        <td className="px-4 py-3 text-center">{row.ana ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <AlertCircle size={18} className="mx-auto text-slate-300" />}</td>
                        <td className="px-4 py-3 text-center">{row.sup ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <AlertCircle size={18} className="mx-auto text-slate-300" />}</td>
                        <td className="px-4 py-3 text-center">{row.adm ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <AlertCircle size={18} className="mx-auto text-slate-300" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
