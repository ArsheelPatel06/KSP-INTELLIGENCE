import React from 'react';
import { Sparkles, Network } from 'lucide-react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { initialNetworkNodes, initialNetworkEdges } from '../../../mockData/mockNetwork';
import { CustomEntityNode } from '../../network/CustomEntityNode';
import { Btn } from '../../common/ButtonSystem';

const nodeTypes = { customEntity: CustomEntityNode };

export const NetworkTab = ({ onOpenDrawer }) => {
  const onNodeClick = (event, node) => {
    // Open the drawer with the node data
    // Map the node type to our drawer types
    let type = 'suspect';
    if (node.data.label === 'Phone') type = 'phone';
    if (node.data.label === 'Vehicle') type = 'vehicle';
    
    // Fallback mapping for the drawer if it doesn't support phone/vehicle yet
    if (type !== 'suspect') {
       type = 'suspect'; // For now, just show as suspect or add fallback in drawer
    }
    
    onOpenDrawer({ 
      type, 
      data: { 
        name: node.data.label,
        alias: node.data.sub,
        status: 'Node Clicked'
      } 
    });
  };

  return (
    <div className="space-y-4 animate-fade-in h-[600px] flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">Criminal Network Graph</h3>
        <Btn variant="ai" size="sm" icon={Sparkles}>Expand Network Analysis</Btn>
      </div>
      <div className="flex-1 w-full rounded-[16px] overflow-hidden border border-gray-200 bg-white shadow-sm relative">
        <ReactFlow
          nodes={initialNetworkNodes}
          edges={initialNetworkEdges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="#cbd5e1" gap={20} size={2} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
