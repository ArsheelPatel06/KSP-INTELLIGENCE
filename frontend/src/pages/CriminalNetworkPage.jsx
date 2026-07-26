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
import { Network, Search } from 'lucide-react';

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
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in">
      {/* Top Header & Toolbar */}
      <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Network size={20} className="text-blue-400" />
            <span>Criminal Link Analysis & Entity Relationship Network</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive multi-entity network: Suspects, Mule Accounts, Burner IMEIs, Vehicles & Cases.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node by name / IMEI..."
              className="w-full bg-[#000000] border border-[#27272A] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#000000] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="all">All Entity Categories</option>
            <option value="suspect">Suspects (Red)</option>
            <option value="bank">Bank Accounts (Purple)</option>
            <option value="phone">Burner SIMs (Cyan)</option>
            <option value="vehicle">Vehicles (Amber)</option>
            <option value="case">Cases (Blue)</option>
          </select>
        </div>
      </div>

      {/* Main Canvas + Inspector */}
      <div className="flex-1 bg-[#000000] border border-[#27272A] rounded-xl overflow-hidden relative flex shadow-2xl">
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
            className="bg-[#000000]"
          >
            <Background color="#27272A" gap={20} />
            <Controls className="!bg-[#0A0A0A] !border-[#27272A] !text-white" />
            <MiniMap nodeColor="#3B82F6" maskColor="rgba(0, 0, 0, 0.8)" className="!bg-[#0A0A0A] !border-[#27272A]" />
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
