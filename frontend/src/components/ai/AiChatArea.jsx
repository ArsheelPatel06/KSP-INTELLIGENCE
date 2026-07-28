import React, { useState, useRef, useEffect } from 'react';
import { Bot, Cpu, Network, Database, Mic, Paperclip, Camera, Folder, Zap, FileText, Search, Clock, ShieldAlert, ImageIcon, Video, User, Car, Sparkles, AlertTriangle, FileBarChart, Play } from 'lucide-react';
import { useInvestigation } from './InvestigationState';
import { IntentEngine } from './IntentEngine';

export const AiChatArea = ({ onSendMessage, onToggleWorkspace, workspaceOpen }) => {
  const { messages, status, activeAgents, currentContext, setActiveTab } = useInvestigation();
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleViewClick = (type) => {
    const typeMap = {
      'timeline': 'Timeline',
      'evidence': 'Evidence',
      'graph': 'Network',
      'report': 'Reports',
      'search_case': 'Overview',
    };
    setActiveTab(typeMap[type?.toLowerCase()] || 'Overview');
    if (!workspaceOpen && onToggleWorkspace) onToggleWorkspace();
  };

  // Only auto-scroll when the number of messages changes (new message added)
  const prevLenRef = useRef(0);
  useEffect(() => {
    if (messages.length !== prevLenRef.current) {
      prevLenRef.current = messages.length;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Also scroll when thinking starts so the agent indicator is visible
  const prevStatusRef = useRef('idle');
  useEffect(() => {
    if (status === 'thinking' && prevStatusRef.current !== 'thinking') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || status === 'thinking') return;
    
    const classifiedIntent = IntentEngine.classify(inputMessage, currentContext);
    onSendMessage(inputMessage, classifiedIntent);
    setInputMessage('');
  };

  const getSuggestions = () => {
    return [
      { title: "Find Mastermind", icon: Network },
      { title: "Show Network", icon: Network },
      { title: "Summarize Case", icon: FileText },
      { title: "Predict Hotspot", icon: ShieldAlert },
      { title: "Generate Chargesheet", icon: FileBarChart }
    ];
  };

  return (
    <div className="h-full flex flex-col rounded-[18px] shadow-sm border border-gray-200 bg-white relative">
      
      {/* Premium Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md rounded-t-[20px] z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm relative">
            <Bot size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
          </div>
          <div>
            <div className="font-bold text-[15px] text-slate-800">Sentinel AI Investigation Copilot</div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Connected</span>
              <span>•</span>
              <span>Evidence Indexed 14,203</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 bg-slate-50">
              <Network size={12} className="text-blue-500" /> <span>Graph Online</span>
            </div>
          </div>
          <button
            onClick={onToggleWorkspace}
            className="ml-1 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title={workspaceOpen ? 'Hide Workspace' : 'Show Workspace'}
          >
            <Database size={16} />
          </button>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/30">
        
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center animate-fade-in pb-10">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-6 relative">
               <Bot size={40} />
               <div className="absolute inset-0 bg-blue-400/20 rounded-2xl animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">How can I assist your investigation?</h2>
            <p className="text-slate-500 font-medium mb-8 text-center max-w-md text-[14px]">
              I am Sentinel, your AI Investigation Copilot. I can search databases, analyze patterns, build timelines, and map criminal networks.
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              {[
                { title: "Search FIR-089", desc: "Lookup an existing report", icon: Search },
                { title: "Search Ramesh Shetty", desc: "Person profile & history", icon: User },
                { title: "Track KA01MX9234", desc: "Vehicle location tracking", icon: Car },
                { title: "Find IMEI Activity", desc: "Device network analysis", icon: Network }
              ].map((ex, i) => (
                <button key={i} onClick={() => setInputMessage(ex.title)} className="flex items-start gap-3 p-4 rounded-[16px] bg-white border border-gray-200 hover:border-blue-300 hover:shadow-[0_4px_12px_rgba(37,99,235,0.06)] transition-all text-left group">
                   <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                     <ex.icon size={16} />
                   </div>
                   <div>
                     <div className="text-[13px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{ex.title}</div>
                     <div className="text-[11px] font-medium text-slate-500 mt-0.5">{ex.desc}</div>
                   </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* User Message */}
            {msg.sender === 'user' && (
              <div className="max-w-[80%] rounded-[20px] rounded-tr-[4px] px-5 py-3 shadow-md" style={{ backgroundColor: '#2563eb', color: '#fff' }}>
                <p className="font-medium text-[15px] leading-relaxed">{msg.text}</p>
              </div>
            )}

            {/* AI Message - Simple Chat */}
            {msg.sender === 'ai' && (msg.type === 'chat' || msg.isWelcome) && (
              <div className="flex items-start gap-4 w-full max-w-[90%] group animate-fade-in">
                <div className="w-8 h-8 rounded-[10px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
                  <Bot size={16} />
                </div>
                <div className="px-5 py-4 rounded-[20px] rounded-tl-[4px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white transition-all">
                  <p className="font-medium text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            )}
            
            {/* AI Message - Artifact generation (Timeline, Graph, Analysis) */}
            {msg.sender === 'ai' && msg.type !== 'chat' && !msg.isWelcome && (
              <div className="flex items-start gap-4 w-full max-w-[95%] animate-fade-in">
                <div className="w-8 h-8 rounded-[10px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
                  <Bot size={16} />
                </div>
                <div className="w-full">
                  <div className="px-5 py-4 rounded-[20px] rounded-tl-[4px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white mb-3">
                     <p className="font-medium text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  {/* Dynamic Artifact Card */}
                  <div className="w-full sm:w-[400px] p-5 rounded-[16px] border border-emerald-200 bg-emerald-50/50 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        {msg.type === 'timeline' ? <Clock size={20} /> : msg.type === 'graph' ? <Network size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-slate-800 capitalize">{msg.type} Generated</div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">Loaded in Investigation Workspace</div>
                      </div>
                    </div>
                    <button onClick={() => handleViewClick(msg.type)} className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-[12px] font-bold shadow-sm hover:bg-emerald-100 transition-colors">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ))}

        {/* Multi-Agent Thinking State */}
        {status === 'thinking' && (
          <div className="flex items-start gap-4 w-full max-w-[95%] animate-fade-in">
             <div className="w-8 h-8 rounded-[10px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-200/50 animate-pulse"></div>
                  <Bot size={16} className="relative z-10" />
             </div>
            <div className="flex flex-col gap-3 p-5 rounded-[20px] rounded-tl-[4px] border border-gray-200 bg-white shadow-sm w-[320px]">
              <div className="font-bold text-[13px] text-blue-600 flex items-center gap-2">
                <Sparkles size={14} className="animate-spin-slow" /> Agents Processing
              </div>
              <div className="space-y-3 mt-1">
                {activeAgents.length === 0 && (
                  <div className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></div> Initializing...
                  </div>
                )}
                {activeAgents.map((agent, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {agent}
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-500 w-1/2 animate-[pulse_1s_infinite]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Area */}
      <div className="p-6 bg-white rounded-b-[20px] border-t border-gray-100 z-10">
        
        {/* Horizontal Suggested Actions — premium pills */}
        {status === 'idle' && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3">
            {getSuggestions().map((action, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(action.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-[12px] font-semibold text-slate-600 hover:text-blue-700 transition-all shrink-0"
              >
                <action.icon size={12} className="text-blue-500" />
                {action.title}
              </button>
            ))}
          </div>
        )}

        {/* Premium Input Bar */}
        <div className="rounded-[18px] border border-gray-200 bg-slate-50 focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.08)] focus-within:border-blue-300 transition-all">
          <form onSubmit={handleSend} className="flex flex-col">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Sentinel to investigate, analyze, or search..." 
              className="w-full bg-transparent outline-none font-medium text-[16px] text-slate-800 placeholder-slate-400 px-4 pt-3 pb-3"
              disabled={status === 'thinking'}
            />
            
            <div className="flex items-center justify-between px-2 pb-1 pt-1">
              {/* Left Icons */}
              <div className="flex items-center gap-1.5">
                <input type="file" ref={fileInputRef} multiple className="hidden" />
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Attach Image"><ImageIcon size={18} /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Attach PDF"><FileText size={18} /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Attach Audio"><Mic size={18} /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Attach Video"><Video size={18} /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Use Camera"><Camera size={18} /></button>
              </div>
              
              {/* Right Action */}
              <div className="flex items-center gap-2">
                <button type="button" className={`p-2.5 rounded-full transition-all ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} onClick={() => setIsRecording(!isRecording)}>
                  <Mic size={20} />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || status === 'thinking'}
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-200 bg-blue-600 hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] group"
                >
                  <Zap size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};
