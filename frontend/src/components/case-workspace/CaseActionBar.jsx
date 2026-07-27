import React from 'react';
import { Sparkles, Clock, Network, FileCheck2, UserPlus, FileText, Download, MoreHorizontal, UserX, UserCheck, Scale, BarChart3 } from 'lucide-react';
import { BtnIcon, Btn } from '../common/ButtonSystem';

export const CaseActionBar = ({ activeTab, onTabChange }) => {
  const actions = [
    { id: 'ai', icon: Sparkles, label: 'AI Analysis', variant: 'ai' },
    { id: 'timeline', icon: Clock, label: 'Timeline', variant: 'secondary' },
    { id: 'suspects', icon: UserX, label: 'Suspects/Victims', variant: 'secondary' },
    { id: 'officers', icon: UserCheck, label: 'Officers', variant: 'secondary' },
    { id: 'evidence', icon: FileCheck2, label: 'Evidence', variant: 'secondary' },
    { id: 'notes', icon: FileText, label: 'Notes', variant: 'secondary' },
    { id: 'network', icon: Network, label: 'Graph', variant: 'secondary' },
    { id: 'court', icon: Scale, label: 'Court', variant: 'secondary' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', variant: 'secondary' },
  ];

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border border-gray-200 px-4 py-3 shadow-sm rounded-[16px] flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {actions.map(action => (
        <Btn 
          key={action.id}
          variant={activeTab === action.id ? 'primary' : action.variant}
          size="md"
          icon={action.icon}
          onClick={() => onTabChange(action.id)}
        >
          {action.label}
        </Btn>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Btn variant="secondary" size="md" icon={Download}>Export</Btn>
        <BtnIcon icon={MoreHorizontal} variant="ghost" />
      </div>
    </div>
  );
};
