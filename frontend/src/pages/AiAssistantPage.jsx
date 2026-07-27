import React, { useState } from 'react';
import { InvestigationStateProvider, useInvestigation } from '../components/ai/InvestigationState';
import { AiSidebar } from '../components/ai/AiSidebar';
import { AiChatArea } from '../components/ai/AiChatArea';
import { AiWorkspace } from '../components/ai/AiWorkspace';
import { aiService } from '../services/ai.service';
import { IntentEngine } from '../components/ai/IntentEngine';

const AiAssistantLayout = () => {
  const { 
    setInvestigationContext, 
    setMessages, 
    setStatus, 
    setActiveAgents,
    addArtifact,
    setEvidenceCount,
    setPeopleCount,
    setVehiclesCount,
    setTimelineUpdated,
    setConfidence,
    setActiveTab,
    clearInvestigation
  } = useInvestigation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  const handleSendMessage = async (textToSend, intent) => {
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setStatus('thinking');
    
    if (intent === 'timeline') { setActiveTab('Timeline'); setWorkspaceOpen(true); }
    else if (intent === 'search_person') { setActiveTab('People'); setWorkspaceOpen(true); }
    else if (intent === 'search_vehicle') { setActiveTab('Vehicles'); setWorkspaceOpen(true); }
    else if (intent === 'graph') { setActiveTab('Graph'); setWorkspaceOpen(true); }
    else if (intent === 'report') { setActiveTab('Reports'); setWorkspaceOpen(true); }
    
    if (intent === 'investigation' || intent === 'search_case' || intent === 'search') {
      setActiveAgents(['Investigation Agent: Collecting Evidence']);
      setTimeout(() => setActiveAgents(prev => [...prev, 'Knowledge Graph: Searching Connections']), 2000);
      setTimeout(() => setActiveAgents(prev => [...prev, 'Analytics Agent: Computing Risk']), 4000);
      setActiveTab('Overview');
      setWorkspaceOpen(true);
    } else if (intent === 'timeline') {
      setActiveAgents(['Timeline Agent: Building Events']);
    } else if (intent === 'graph') {
      setActiveAgents(['Graph Agent: Traversing Nodes']);
    } else {
      setActiveAgents(['Routing Query...']);
    }

    try {
      const response = await aiService.query(textToSend);
      const payload = response?.data?.payload || {};
      const finalIntent = payload.isConversational ? 'chat' : (intent === 'analysis' ? 'analysis' : intent);

      setStatus('idle');
      setActiveAgents([]);

      if (finalIntent !== 'chat') {
        setEvidenceCount(prev => prev + 4);
        setPeopleCount(prev => prev + 2);
        setVehiclesCount(prev => prev + 1);
        setTimelineUpdated('Just now');
        setConfidence(98);
        addArtifact('reports', { title: 'AI Analysis', summary: payload.summary || textToSend });
      }

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        type: finalIntent,
        text: payload.summary || "Investigation complete.",
        payload: payload
      }]);

    } catch (error) {
      setStatus('idle');
      setActiveAgents([]);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'ai',
        type: 'chat',
        text: "Error: Unable to reach the Intelligence Core. " + error.message
      }]);
    }
  };

  const handleNewInvestigation = () => {
    // Wipe all previous state first, then set fresh context
    clearInvestigation();
    setInvestigationContext({ type: 'FIR', id: `FIR-${Date.now()}`, officer: 'DCP Rathore' });
    setMessages([{ 
      id: `welcome-${Date.now()}`, 
      sender: 'ai', 
      type: 'chat', 
      isWelcome: true, 
      text: 'New investigation workspace created. What would you like to investigate? Search an FIR, person, vehicle, or IMEI.' 
    }]);
    setActiveTab('Overview');
    setWorkspaceOpen(true);
  };

  const handleHistoryClick = (title) => {
    clearInvestigation();
    setInvestigationContext({ type: 'Case', id: title, officer: 'Assigned Officer' });
    setMessages([{ 
      id: `history-${Date.now()}`, 
      sender: 'ai', 
      type: 'chat', 
      isWelcome: true, 
      text: `Loaded investigation context for "${title}". How can I assist?` 
    }]);
    setActiveTab('Overview');
    setWorkspaceOpen(true);
  };

  return (
    <div className="px-5 py-4 bg-slate-50 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
      <div className="flex gap-4 h-full max-w-[1920px] mx-auto overflow-hidden">
        
        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${sidebarOpen ? 'w-[220px]' : 'w-[48px]'}`}>
          <AiSidebar 
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onNewInvestigation={handleNewInvestigation}
            onHistoryClick={handleHistoryClick}
            onTemplateClick={(template) => handleSendMessage(template, IntentEngine.classify(template))}
          />
        </div>
        
        {/* Chat Area — flex-1 so it takes all remaining space */}
        <div className="flex-1 min-w-0">
          <AiChatArea 
            onSendMessage={handleSendMessage}
            onToggleWorkspace={() => setWorkspaceOpen(o => !o)}
            workspaceOpen={workspaceOpen}
          />
        </div>
        
        {/* Workspace Panel */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden h-full ${workspaceOpen ? 'w-[280px]' : 'w-[48px]'}`}>
          <AiWorkspace 
            isOpen={workspaceOpen}
            onToggle={() => setWorkspaceOpen(o => !o)}
          />
        </div>

      </div>
    </div>
  );
};

export const AiAssistantPage = () => (
  <InvestigationStateProvider>
    <AiAssistantLayout />
  </InvestigationStateProvider>
);
