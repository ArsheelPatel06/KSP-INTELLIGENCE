import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, X, ArrowRight, User } from 'lucide-react';
import { chatService } from '../../services/chat.service';

export const QuickCopilot = ({ isOpen, onClose }) => {
  const { isDarkMode, copilotMessages, setCopilotMessages, chatSessionId, setChatSessionId } = useApp();
  const navigate = useNavigate();
  const border = 'var(--t-border)';
  const textPrimary = 'var(--t-text-primary)';
  const textSecondary = 'var(--t-text-secondary)';

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setCopilotMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Add loading indicator
    const loadingId = Date.now() + 1;
    setCopilotMessages(prev => [...prev, { id: loadingId, sender: 'bot', text: 'Analyzing your request...' }]);

    try {
      let sessionId = chatSessionId;
      if (!sessionId) {
        // Create session
        const sessionRes = await chatService.createSession("General Assistant Inquiry");
        sessionId = sessionRes.item.id;
        setChatSessionId(sessionId);
      }

      // Send message
      const res = await chatService.sendMessage(sessionId, userText);
      const answer = res.item.answer;
      
      // Build response text
      let botText = answer.summary;
      if (answer.evidence && answer.evidence.length > 0) {
        botText += `\n\nEvidence: ${answer.evidence.join(', ')}`;
      }

      // Replace loading indicator
      setCopilotMessages(prev => prev.map(m => m.id === loadingId ? { id: Date.now() + 2, sender: 'bot', text: botText } : m));
    } catch (error) {
      console.error(error);
      setCopilotMessages(prev => prev.map(m => m.id === loadingId ? { id: Date.now() + 2, sender: 'bot', text: 'Error connecting to Sentinel AI. Please try again later.' } : m));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in-up" style={{ 
      position: 'fixed', 
      bottom: '6.5rem', 
      right: '2rem', 
      width: '360px', 
      height: '500px', 
      backgroundColor: isDarkMode ? '#0B1120' : '#FFFFFF', 
      zIndex: 1000, 
      display: 'flex', 
      flexDirection: 'column', 
      border: `1px solid ${border}`, 
      borderRadius: '1rem',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#131B2E' : '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.3)', position: 'relative' }}>
            <BrainCircuit size={18} style={{ color: '#3B82F6' }} />
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '50%', border: `2px solid ${isDarkMode ? '#0B1120' : '#FFF'}` }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: textPrimary, fontSize: '0.9375rem' }}>Sentinel Quick Copilot</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>Connected & Listening</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer', padding: '0.25rem' }}><X size={18} /></button>
      </div>
      
      {/* Chat Area */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }}>
        {copilotMessages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            {msg.sender === 'bot' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>
                <BrainCircuit size={12} style={{ color: '#3B82F6' }} />
                <span style={{ fontSize: '0.625rem', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Sentinel</span>
              </div>
            )}
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0', 
              backgroundColor: msg.sender === 'user' ? '#3B82F6' : (isDarkMode ? '#1E293B' : '#FFFFFF'), 
              color: msg.sender === 'user' ? '#FFFFFF' : textPrimary, 
              fontSize: '0.8125rem',
              border: msg.sender === 'user' ? 'none' : `1px solid ${border}`,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              lineHeight: 1.5
            }}>
              {msg.text.includes('7 Cyber Fraud FIRs') ? (
                <>Good afternoon, DCP V. Rathore. I have prepared your daily briefing. There is a cluster of <strong style={{ color: msg.sender === 'user' ? '#FFF' : '#EF4444' }}>7 Cyber Fraud FIRs</strong> in Indiranagar that requires your attention.</>
              ) : (
                msg.text
              )}
            </div>
            {msg.action === 'open_workspace' && (
              <button onClick={() => navigate('/ai-assistant')} style={{ marginTop: '0.5rem', alignSelf: 'flex-start', fontSize: '0.75rem', padding: '0.5rem 1rem', backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9', color: '#3B82F6', border: `1px solid ${border}`, borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'background-color 0.2s' }}>
                Open Full Workspace <ArrowRight size={12} />
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '0.75rem', borderTop: `1px solid ${border}`, backgroundColor: isDarkMode ? '#131B2E' : '#FFFFFF' }}>
        <div style={{ position: 'relative' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a quick question..." 
            style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 1rem', backgroundColor: isDarkMode ? '#0B1120' : '#F1F5F9', border: `1px solid ${border}`, borderRadius: '9999px', color: textPrimary, fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }} 
          />
          <button onClick={handleSend} style={{ position: 'absolute', right: '0.25rem', top: '50%', transform: 'translateY(-50%)', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: input.trim() ? '#3B82F6' : (isDarkMode ? '#334155' : '#CBD5E1'), display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: input.trim() ? 'pointer' : 'default', color: '#FFF', transition: 'background-color 0.2s' }}>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
