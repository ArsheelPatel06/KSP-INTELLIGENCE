import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search, Plus, Filter, MessageSquare, Bot, Database, CheckCircle2, AlertTriangle, FileText,
  User, MapPin, Phone, Car, CreditCard, ChevronRight, Download, Share2, Copy, Bookmark, RefreshCw, Link, Network, Mic, Paperclip, Camera, Folder, Zap, Clock, ShieldAlert, FileBarChart, LayoutDashboard, Cpu
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { aiService } from '../services/ai.service';

export const AiAssistantPage = () => {
  const { aiLanguage, setAiLanguage, isDarkMode } = useApp();
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [investigationState, setInvestigationState] = useState('idle'); // 'idle', 'thinking', 'complete'
  const [thinkingStep, setThinkingStep] = useState(0);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      setInputMessage(prev => prev ? `${prev} [Attached: ${fileNames}]` : `[Attached: ${fileNames}] `);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const smartTemplates = [
    { title: "Investigate Suspect", icon: User },
    { title: "Find Criminal Network", icon: Network },
    { title: "Analyze FIR", icon: FileText },
    { title: "Predict Next Crime", icon: ShieldAlert },
    { title: "Generate Chargesheet", icon: FileBarChart },
    { title: "Find Money Trail", icon: CreditCard },
  ];

  const quickChips = [
    "Find mastermind", "Show timeline", "Summarize case", "Generate report", "Predict hotspot", "Find network"
  ];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      isWelcome: true,
      text: "Sentinel AI Intelligence Engine online. I am integrated with Karnataka State Police databases, FIR indices, and real-time knowledge graphs. How can I assist your investigation today?"
    }
  ]);

  const handleSend = async (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setInvestigationState('thinking');
    setThinkingStep(1);

    // Start a fake progress timer for visual effect while waiting for backend
    const progressInterval = setInterval(() => {
      setThinkingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1500);

    try {
      const start = Date.now();
      const response = await aiService.query(textToSend);
      const duration = ((Date.now() - start) / 1000).toFixed(1) + ' sec';
      
      clearInterval(progressInterval);
      setThinkingStep(5);
      
      setTimeout(() => {
        setInvestigationState('complete');
        const aiReport = mapPayloadToReport(textToSend, response?.data?.payload || {}, duration);
        setMessages(prev => [...prev, aiReport]);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setInvestigationState('complete');
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'ai',
        isWelcome: true, // Reuse simple bubble
        text: "Error: Unable to reach the Intelligence Core. " + error.message
      }]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, investigationState]);

  const handleNewInvestigation = () => {
    setMessages([messages[0]]);
    setInvestigationState('idle');
    setInputMessage('');
  };

  const handleHistoryClick = (item) => {
    handleNewInvestigation();
    setTimeout(() => handleSend(`Summarize intelligence for: ${item}`), 100);
  };

  const handleActionClick = (action) => {
    if (action.includes('FIR') || action.includes('Case')) {
      navigate('/cases');
    } else if (action.includes('Report') || action.includes('Chargesheet')) {
      navigate('/reports');
    } else {
      alert(`Action Triggered: ${action}\nThis workflow has been initialized.`);
    }
  };

  const handleMessageAction = (action) => {
    if (action === 'Export PDF') {
      const chatText = messages.map(m => `[${m.sender.toUpperCase()}]: ${m.text || m.summary}`).join('\n\n');
      const blob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Intel_Report_${Date.now()}.txt`;
      a.click();
    } else if (action === 'Copy') {
      navigator.clipboard.writeText(messages[messages.length - 1]?.summary || '');
      alert('Report copied to clipboard.');
    } else {
      alert(`${action} triggered successfully.`);
    }
  };

  const mapPayloadToReport = (query, payload, duration) => {
    const getIcon = (type) => {
      switch(type?.toLowerCase()) {
        case 'phone': return Phone;
        case 'bank': case 'financial': return CreditCard;
        case 'vehicle': return Car;
        case 'location': return MapPin;
        case 'person': return User;
        default: return FileText;
      }
    };

    return {
      id: `report-${Date.now()}`,
      sender: 'ai',
      isReport: true,
      query: query,
      confidence: payload.confidence || 95,
      duration: duration || "2.1 sec",
      sources: payload.sources?.length ? payload.sources : ["SQL", "Knowledge Graph", "FIR Index"],
      summary: payload.summary || "No intelligence summary generated.",
      stats: { 
        members: payload.analytics?.members || 0, 
        firs: payload.analytics?.firs || 0, 
        frozenAssets: payload.analytics?.frozenAssets || "₹0", 
        risk: payload.analytics?.risk || "Unknown" 
      },
      evidence: (payload.evidence || []).map(ev => ({
        type: ev.type || 'unknown',
        label: ev.label || ev.type || 'Evidence',
        value: ev.value || 'N/A',
        meta: ev.meta || '',
        icon: getIcon(ev.type)
      })),
      relatedFirs: payload.relatedCases || [],
      timeline: payload.timeline || [
        { date: "Query Date", event: "Intelligence check initiated" }
      ],
      actions: payload.recommendations?.length ? payload.recommendations : ["View Cases"]
    };
  };

  return (
    <div 
      className="flex w-full overflow-hidden text-sm rounded-xl border shadow-xl" 
      style={{ 
        height: 'calc(100vh - 120px)',
        backgroundColor: 'var(--t-bg-root)', 
        color: 'var(--t-text-primary)', 
        borderColor: 'var(--t-border)' 
      }}
    >
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANEL: Investigation Sessions (25%) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-1/4 h-full flex flex-col border-r" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card)' }}>
        
        <div className="p-4 border-b" style={{ borderColor: 'var(--t-border)' }}>
          <button 
            onClick={handleNewInvestigation}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-white font-semibold transition-all hover:opacity-90 shadow-sm" style={{ backgroundColor: 'var(--t-accent)' }}
          >
            <Plus size={18} />
            <span>New Investigation</span>
          </button>
        </div>

        <div className="p-4 border-b" style={{ borderColor: 'var(--t-border)' }}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
            <input 
              type="text" 
              placeholder="Search Investigation..." 
              className="w-full pl-9 pr-3 py-2 rounded-md outline-none"
              style={{ backgroundColor: 'var(--t-bg-input)', border: '1px solid var(--t-border)', color: 'var(--t-text-primary)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* History */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">Today</div>
            <div className="space-y-1">
              {['Cyber Fraud Cluster', 'Snake Shetty', 'FIR-2026-0089'].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => handleHistoryClick(item)}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <MessageSquare size={14} className="opacity-50" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">Yesterday</div>
            <div className="space-y-1">
              {['ATM Skimming', 'Vehicle Theft Ring', 'Hawala Investigation'].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => handleHistoryClick(item)}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <MessageSquare size={14} className="opacity-50" />
                  <span className="font-medium opacity-80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Templates */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">Smart Templates</div>
            <div className="grid grid-cols-2 gap-2">
              {smartTemplates.map((template, i) => (
                <div 
                  key={i} 
                  onClick={() => setInputMessage(template.title)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer hover:border-blue-500 hover:shadow-md transition-all text-center gap-1.5"
                  style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card-alt)' }}
                >
                  <template.icon size={18} className="opacity-70 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-semibold leading-tight">{template.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ------------------------------------------------------------- */}
      {/* CENTER PANEL: Conversation Workspace (50%) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-2/4 h-full flex flex-col relative" style={{ backgroundColor: 'var(--t-bg-root)' }}>
        
        {/* Top Header */}
        <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-4 shadow-sm z-10" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bot size={20} />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">SENTINEL AI INVESTIGATION COPILOT</div>
              <div className="text-[10px] uppercase font-bold opacity-60 flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>
                <span>•</span>
                <span>Response: 2.1s</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/5 dark:bg-white/5">
              <Cpu size={14} className="opacity-60" /> LLM: <span className="font-semibold">Llama-3</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/5 dark:bg-white/5">
              <Network size={14} className="opacity-60" /> Graph: <span className="font-semibold text-green-600 dark:text-green-400">Connected</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/5 dark:bg-white/5">
              <Database size={14} className="opacity-60" /> Evidence: <span className="font-semibold">14.2k</span>
            </div>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* User Message */}
              {msg.sender === 'user' && (
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-5 py-3 shadow-md" style={{ backgroundColor: 'var(--t-accent)', color: '#fff' }}>
                  <p className="font-medium text-sm">{msg.text}</p>
                </div>
              )}

              {/* Welcome Message */}
              {msg.sender === 'ai' && msg.isWelcome && (
                <div className="flex items-start gap-3 w-full max-w-[90%]">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white shadow-md">
                    <Bot size={18} />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm border shadow-sm" style={{ backgroundColor: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
                    <p className="font-medium leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}

              {/* AI Report Card */}
              {msg.sender === 'ai' && msg.isReport && (
                <div className="w-full">
                  <div className="rounded-xl border shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
                    
                    {/* Report Header */}
                    <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card-alt)' }}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Bot size={18} className="text-blue-600 dark:text-blue-400" />
                        <span>Investigation Report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Confidence: {msg.confidence}%</Badge>
                        <span className="text-xs opacity-50">{msg.duration}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* Executive Summary */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Executive Summary</div>
                        <p className="text-sm font-semibold leading-relaxed border-l-4 pl-3 py-1" style={{ borderColor: 'var(--t-accent)' }}>
                          {msg.summary}
                        </p>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                            <div className="text-[10px] uppercase opacity-60 font-bold">Estimated Members</div>
                            <div className="text-lg font-black mt-1">{msg.stats.members}</div>
                          </div>
                          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                            <div className="text-[10px] uppercase opacity-60 font-bold">Linked FIRs</div>
                            <div className="text-lg font-black mt-1">{msg.stats.firs}</div>
                          </div>
                          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                            <div className="text-[10px] uppercase opacity-60 font-bold">Frozen Assets</div>
                            <div className="text-lg font-black mt-1 text-green-600 dark:text-green-400">{msg.stats.frozenAssets}</div>
                          </div>
                          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                            <div className="text-[10px] uppercase opacity-60 font-bold">Risk Level</div>
                            <div className="text-lg font-black mt-1 text-red-600 dark:text-red-400">{msg.stats.risk}</div>
                          </div>
                        </div>
                      </div>

                      <hr style={{ borderColor: 'var(--t-border)' }} />

                      {/* Evidence Cards */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Key Evidence</div>
                        <div className="grid grid-cols-3 gap-3">
                          {msg.evidence.map((ev, i) => (
                            <div key={i} className="p-3 rounded-lg border flex flex-col gap-2 hover:border-blue-500 cursor-pointer transition-colors" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                              <div className="flex items-center justify-between opacity-70">
                                <span className="text-[10px] font-bold uppercase">{ev.label}</span>
                                <ev.icon size={14} />
                              </div>
                              <div className="font-bold truncate">{ev.value}</div>
                              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">{ev.meta}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline & FIRs */}
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Timeline</div>
                          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {msg.timeline.map((t, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="text-xs font-bold opacity-60 w-12 text-right">{t.date}</div>
                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 z-10" />
                                <div className="text-sm font-semibold p-2 rounded border flex-1" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                                  {t.event}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Related FIRs</div>
                          <div className="flex flex-wrap gap-2">
                            {msg.relatedFirs.map((fir, i) => (
                              <div key={i} className="px-3 py-1.5 rounded-full border text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer transition-all flex items-center gap-1" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                                <FileText size={12} /> {fir}
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Knowledge Graph Preview</div>
                            <div 
                              onClick={() => navigate('/cases')}
                              className="p-4 rounded-lg border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 transition-all" 
                              style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}
                            >
                              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold opacity-80">
                                <span className="flex items-center gap-1 bg-black/10 dark:bg-white/10 px-2 py-1 rounded"><User size={12}/> Suspect</span> 
                                <ChevronRight size={12} className="opacity-50" /> 
                                <span className="flex items-center gap-1 bg-black/10 dark:bg-white/10 px-2 py-1 rounded"><Phone size={12}/> Phone</span> 
                                <ChevronRight size={12} className="opacity-50" /> 
                                <span className="flex items-center gap-1 bg-black/10 dark:bg-white/10 px-2 py-1 rounded"><CreditCard size={12}/> Bank</span>
                              </div>
                              <span className="text-[10px] text-blue-500 uppercase tracking-widest mt-1 font-bold">Click to Expand Graph</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr style={{ borderColor: 'var(--t-border)' }} />

                      {/* Sources Used */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Sources Analyzed</div>
                        <div className="flex gap-4">
                          {msg.sources.map((src, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs font-medium opacity-80">
                              <CheckCircle2 size={12} className="text-green-500" /> {src}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Report Footer / Actions */}
                    <div className="px-5 py-4 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card-alt)' }}>
                      <div className="flex flex-wrap gap-2">
                        {msg.actions.map((act, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleActionClick(act)}
                            className="px-3 py-1.5 rounded text-white text-xs font-bold hover:opacity-90 shadow-sm transition-colors" style={{ backgroundColor: 'var(--t-accent)' }}
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Message Actions */}
                  <div className="flex items-center gap-4 mt-2 px-2 opacity-50 hover:opacity-100 transition-opacity">
                    <button onClick={() => handleMessageAction('Copy')} className="flex items-center gap-1 text-[11px] font-bold hover:text-blue-500"><Copy size={12} /> Copy</button>
                    <button onClick={() => handleMessageAction('Bookmark')} className="flex items-center gap-1 text-[11px] font-bold hover:text-blue-500"><Bookmark size={12} /> Bookmark</button>
                    <button onClick={() => handleMessageAction('Export PDF')} className="flex items-center gap-1 text-[11px] font-bold hover:text-blue-500"><Download size={12} /> Export PDF</button>
                    <button onClick={() => handleMessageAction('Share')} className="flex items-center gap-1 text-[11px] font-bold hover:text-blue-500"><Share2 size={12} /> Share</button>
                    <button onClick={() => handleMessageAction('Regenerate')} className="flex items-center gap-1 text-[11px] font-bold hover:text-blue-500"><RefreshCw size={12} /> Regenerate</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Composer */}
        <div className="p-4 bg-transparent z-10">
          {/* Quick Chips */}
          {investigationState === 'idle' && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-3 px-1">
              {quickChips.map((chip, i) => (
                <button 
                  key={i} 
                  onClick={() => setInputMessage(chip)}
                  className="px-3 py-1 rounded-full border text-xs font-semibold hover:border-blue-500 transition-colors shadow-sm"
                  style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card)', color: 'var(--t-text-primary)' }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="rounded-xl border shadow-lg overflow-hidden flex flex-col" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card)' }}>
            <div className="px-3 py-2 border-b flex items-center gap-3 overflow-x-auto" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card-alt)' }}>
              <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileUpload} style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[11px] font-bold opacity-70 hover:opacity-100 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><Paperclip size={14} /> Attach</button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[11px] font-bold opacity-70 hover:opacity-100 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><Camera size={14} /> Image</button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[11px] font-bold opacity-70 hover:opacity-100 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><FileText size={14} /> FIR</button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[11px] font-bold opacity-70 hover:opacity-100 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><Folder size={14} /> Folder</button>
            </div>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center px-4 py-3 gap-3"
            >
              <button type="button" className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`} onClick={() => setIsRecording(!isRecording)}>
                <Mic size={18} />
              </button>
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Sentinel AI or attach evidence..." 
                className="flex-1 bg-transparent outline-none font-medium placeholder-opacity-50"
                disabled={investigationState === 'thinking'}
                style={{ color: 'var(--t-text-primary)' }}
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim() || investigationState === 'thinking'}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--t-accent)' }}
              >
                <Zap size={18} />
              </button>
            </form>
          </div>
          <div className="text-center text-[10px] font-bold uppercase opacity-40 tracking-wider mt-3">
            Sentinel AI uses deep research and reasoning. Verify critical intel before taking legal action.
          </div>
        </div>

      </div>


      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANEL: Intelligence & Evidence (25%) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-1/4 h-full flex flex-col border-l" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card)' }}>
        
        {/* Thinking State */}
        {investigationState === 'thinking' && (
          <div className="p-6 flex flex-col justify-center h-full space-y-6">
            <div className="text-center font-bold text-lg mb-8 flex flex-col items-center gap-3">
              <Bot size={40} className="text-blue-600 dark:text-blue-400 animate-pulse" />
              <span>Investigation in Progress</span>
            </div>
            
            {[
              { label: "Planning Investigation Strategy", step: 1 },
              { label: "Querying FIR Database & SQL", step: 2 },
              { label: "Loading Knowledge Graph", step: 3 },
              { label: "Analyzing Cross-References", step: 4 },
              { label: "Generating Intelligence Report", step: 5 }
            ].map((task) => (
              <div key={task.step} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className={thinkingStep >= task.step ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-40'}>{task.label}</span>
                  {thinkingStep > task.step && <CheckCircle2 size={14} className="text-green-500" />}
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-bg-root)' }}>
                  <div 
                    className="h-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: thinkingStep > task.step ? '100%' : thinkingStep === task.step ? '60%' : '0%',
                      animation: thinkingStep === task.step ? 'pulse 1s infinite' : 'none',
                      backgroundColor: 'var(--t-accent)'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Complete State */}
        {investigationState === 'complete' && (
          <div className="flex flex-col h-full overflow-hidden animate-fade-in">
            <div className="p-4 border-b" style={{ borderColor: 'var(--t-border)' }}>
              <div className="text-sm font-extrabold uppercase tracking-widest mb-1 text-blue-600 dark:text-blue-400">Evidence Summary</div>
              <div className="text-xs opacity-60 font-semibold">12 FIRs • 17 Suspects • 6 Accounts</div>
            </div>

            <div className="flex border-b overflow-x-auto scrollbar-hide" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-card-alt)' }}>
              {['Entities', 'Evidence', 'Timeline', 'Sources'].map((tab, i) => (
                <button key={i} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${i === 0 ? 'border-b-2 text-blue-600 dark:text-blue-400' : 'opacity-60 hover:opacity-100'}`} style={{ borderColor: i === 0 ? 'var(--t-accent)' : 'transparent' }}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Entities Lists */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">People (17)</div>
                <div className="space-y-2">
                  {['Ramesh Shetty (Target)', 'Vinod Kumar (Associate)', 'Kiran Gowda (Driver)'].map((p, i) => (
                    <div key={i} className="p-2 rounded border flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                      <div className="flex items-center gap-2 font-semibold text-xs"><User size={14} className="opacity-50" /> {p}</div>
                      <ChevronRight size={14} className="opacity-30" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Vehicles (3)</div>
                <div className="space-y-2">
                  {['KA-01-AB-1234 (Thar)', 'KA-04-MJ-8812 (Innova)'].map((p, i) => (
                    <div key={i} className="p-2 rounded border flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                      <div className="flex items-center gap-2 font-semibold text-xs"><Car size={14} className="opacity-50" /> {p}</div>
                      <ChevronRight size={14} className="opacity-30" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Financial (6 Accounts)</div>
                <div className="space-y-2">
                  {['HDFC - 5010029381', 'SBI - 3109283748'].map((p, i) => (
                    <div key={i} className="p-2 rounded border flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-root)' }}>
                      <div className="flex items-center gap-2 font-semibold text-xs"><CreditCard size={14} className="opacity-50" /> {p}</div>
                      <ChevronRight size={14} className="opacity-30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Idle State */}
        {investigationState === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-40">
            <LayoutDashboard size={48} className="mb-4 text-blue-500" />
            <h3 className="font-bold text-lg mb-2">Workspace Empty</h3>
            <p className="text-xs font-medium max-w-[200px] leading-relaxed">Send a query to Sentinel AI to begin compiling evidence and generating intelligence reports.</p>
          </div>
        )}

      </div>

    </div>
  );
};
