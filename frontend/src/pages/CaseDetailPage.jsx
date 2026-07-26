import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  Clock,
  UserCheck,
  UserX,
  FileCheck2,
  Plus,
  Network,
  Download,
  Bot,
  MapPin,
  FileText
} from 'lucide-react';
import { initialNetworkNodes, initialNetworkEdges } from '../mockData/mockNetwork';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { CustomEntityNode } from '../components/network/CustomEntityNode';

const nodeTypes = { customEntity: CustomEntityNode };

export const CaseDetailPage = () => {
  const { id } = useParams();
  const { firs, addFirNote, updateFirStatus } = useApp();
  const navigate = useNavigate();

  // Find target FIR or fallback to default
  const caseId = id || 'FIR-2026-KA-0042';
  const fir = firs.find(f => f.id === caseId || f.firNumber === caseId) || firs[0];

  const [activeTab, setActiveTab] = useState('overview');
  const [newNoteText, setNewNoteText] = useState('');

  const tabs = [
    { id: 'overview', name: 'Overview & Timeline', icon: Clock },
    { id: 'suspects', name: 'Suspects & Victims', icon: UserX },
    { id: 'officers', name: 'Assigned Officers', icon: UserCheck },
    { id: 'evidence', name: 'Evidence & Forensic Files', icon: FileCheck2 },
    { id: 'notes', name: 'Investigation Notes', icon: FileText },
    { id: 'network', name: 'Criminal Network Graph', icon: Network }
  ];

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addFirNote(fir.id, newNoteText);
      setNewNoteText('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* FIR Header */}
      <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-extrabold text-blue-400 font-mono">{fir.firNumber}</span>
              <Badge variant={fir.priority === 'Critical' ? 'danger' : 'warning'} size="md">
                {fir.priority} PRIORITY
              </Badge>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-zinc-900 text-white border border-zinc-800">
                {fir.status}
              </span>
            </div>
            <h1 className="text-lg font-extrabold text-white mt-1">{fir.crimeType}</h1>
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center space-x-2">
              <MapPin size={12} className="text-blue-400" />
              <span>{fir.location.address} • Station: <strong className="text-white">{fir.policeStation}</strong> ({fir.district})</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={fir.status}
              onChange={(e) => updateFirStatus(fir.id, e.target.value)}
              className="bg-[#000000] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
            >
              <option value="Under Investigation">Status: Under Investigation</option>
              <option value="Solved">Status: Solved</option>
              <option value="Charge Sheet Filed">Status: Charge Sheet Filed</option>
              <option value="Pending Forensic">Status: Pending Forensic</option>
            </select>
            <button
              onClick={() => navigate('/ai-assistant')}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Bot size={14} />
              <span>Analyze with AI</span>
            </button>
          </div>
        </div>

        {/* Sections & Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#000000] border border-[#27272A] rounded-lg">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400">Statutory Sections</span>
            <p className="font-bold text-white mt-0.5">{fir.section}</p>
          </div>
          <div className="p-3 bg-[#000000] border border-[#27272A] rounded-lg">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400">Incident & Filing Date</span>
            <p className="font-bold text-white mt-0.5">{fir.incidentDate} (Logged: {fir.reportedDate})</p>
          </div>
          <div className="p-3 bg-[#000000] border border-[#27272A] rounded-lg">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400">AI Pattern Match</span>
            <p className="font-bold text-cyan-400 mt-0.5">{fir.confidenceScore}% Confidence Link</p>
          </div>
        </div>

        {/* AI Executive Summary Banner */}
        <div className="p-4 bg-blue-950/30 border border-blue-800/60 rounded-lg flex items-start space-x-3">
          <Bot size={20} className="text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-blue-400 uppercase tracking-wider block mb-0.5">
              SENTINEL AI Automated Synthesis
            </span>
            <p className="text-zinc-200 leading-relaxed font-normal">{fir.aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#27272A] space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold transition-all flex items-center space-x-2 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-white bg-blue-950/30'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <tab.icon size={15} className="text-blue-400" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 shadow-xl min-h-[400px]">
        {/* Tab 1: Overview & Timeline */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Chronological Case Event Log
            </h3>
            <div className="relative border-l-2 border-[#27272A] ml-4 space-y-6">
              {fir.timeline.map((item, index) => (
                <div key={index} className="ml-6 relative">
                  <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-blue-600 border-4 border-[#0A0A0A]"></span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Suspects & Victims */}
        {activeTab === 'suspects' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-rose-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <UserX size={16} />
                <span>Suspects & Persons of Interest ({fir.suspects.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fir.suspects.map((suspect) => (
                  <div key={suspect.id} className="p-4 bg-[#000000] border border-[#27272A] rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">{suspect.name}</span>
                      <Badge variant={suspect.status === 'In Custody' ? 'success' : 'danger'}>
                        {suspect.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-zinc-400 pt-2 border-t border-[#27272A]">
                      <span>Alias: <strong className="text-white">{suspect.alias}</strong></span>
                      <span>Age: <strong className="text-white">{suspect.age} yrs</strong></span>
                      <span>Phone: <strong className="text-white">{suspect.phone}</strong></span>
                      <span>Vehicle: <strong className="text-white">{suspect.vehicle}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <UserCheck size={16} />
                <span>Complainants & Victims ({fir.victims.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fir.victims.map((victim) => (
                  <div key={victim.id} className="p-4 bg-[#000000] border border-[#27272A] rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">{victim.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{victim.contact}</span>
                    </div>
                    <p className="text-zinc-300 italic">"{victim.statement}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Officers */}
        {activeTab === 'officers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3">
              Assigned Investigation Officers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fir.officers.map((off) => (
                <div key={off.id} className="p-4 bg-[#000000] border border-[#27272A] rounded-xl flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                    {off.rank.split(' ')[0][0]}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">{off.name}</p>
                    <p className="text-zinc-400">{off.rank}</p>
                    <p className="text-blue-400 font-mono text-[10px] mt-0.5">Badge: {off.badge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Evidence Files */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3">
              Secured Digital Evidence & Files
            </h3>
            <div className="space-y-2">
              {fir.evidence.map((ev, i) => (
                <div key={i} className="p-3 bg-[#000000] border border-[#27272A] rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <FileCheck2 size={18} className="text-blue-400" />
                    <div>
                      <p className="font-bold text-white">{ev.file}</p>
                      <p className="text-[10px] text-zinc-500">Type: {ev.type} • Size: {ev.size} • Hash: {ev.hash}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading secure file: ${ev.file}`)}
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white hover:border-blue-500 text-xs font-bold flex items-center space-x-1"
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <form onSubmit={handleAddNoteSubmit} className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                File New Officer Investigation Note
              </label>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter field notes, witness interview observations, or forensic update..."
                rows={3}
                className="w-full bg-[#000000] border border-[#27272A] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center space-x-1.5"
              >
                <Plus size={14} />
                <span>Save Note</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Network Graph */}
        {activeTab === 'network' && (
          <div className="h-[450px] w-full rounded-xl overflow-hidden border border-[#27272A]">
            <ReactFlow
              nodes={initialNetworkNodes}
              edges={initialNetworkEdges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[#000000]"
            >
              <Background color="#27272A" gap={16} />
              <Controls className="!bg-[#0A0A0A] !border-[#27272A] !text-white" />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
};
