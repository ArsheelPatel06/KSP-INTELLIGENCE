import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import { CustomEntityNode } from '../components/network/CustomEntityNode';
import { NodeInspector } from '../components/network/NodeInspector';
import { initialNetworkNodes, initialNetworkEdges } from '../mockData/mockNetwork';
import { Network, Search, Filter } from 'lucide-react';
import { Btn } from '../components/common/ButtonSystem';

const nodeTypes = { customEntity: CustomEntityNode };

export const CriminalNetworkPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNetworkNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialNetworkEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  const filteredNodes = nodes.filter((n) => {
    const matchesCategory = categoryFilter === 'all' || n.data.category === categoryFilter;
    const matchesQuery = !searchQuery || n.data.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-5 pb-4 animate-fade-in font-sans">
      
      {/* Top Header & Toolbar */}
      <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <Network size={24} className="text-blue-600" />
            Criminal Link Analysis &amp; Entity Relationship Network
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Interactive multi-entity network: Suspects, Mule Accounts, Burner IMEIs, Vehicles &amp; Cases.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node by name / IMEI..."
              className="w-full h-10 pl-9 pr-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[13px] font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[13px] font-bold text-slate-700 focus:bg-white focus:border-blue-400 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">All Entity Categories</option>
              <option value="suspect">Suspects (Red)</option>
              <option value="bank">Bank Accounts (Purple)</option>
              <option value="phone">Burner SIMs (Cyan)</option>
              <option value="vehicle">Vehicles (Amber)</option>
              <option value="case">Cases (Blue)</option>
            </select>
          </div>
          <Btn variant="primary" size="md">Run AI Scan</Btn>
        </div>
      </div>

      {/* Main Canvas + Inspector */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[18px] overflow-hidden relative flex shadow-sm">
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50"
          >
            <Background color="#cbd5e1" gap={20} />
            <Controls className="!bg-white !border-gray-200 !text-slate-700 shadow-sm rounded-lg overflow-hidden" />
            <MiniMap nodeColor="#3b82f6" maskColor="rgba(248, 250, 252, 0.7)" className="!bg-white !border-gray-200 shadow-sm rounded-lg overflow-hidden" />
          </ReactFlow>
        </div>

        {/* Selected Node Inspector Drawer */}
        <NodeInspector
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
          onOpenCase={(caseId) => navigate(`/cases/${caseId}`)}
        />
      </div>
    </div>
  );
};
