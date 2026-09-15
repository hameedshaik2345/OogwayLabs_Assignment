"use client";
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  onArtifactGenerated: (content: string) => void;
}

export default function Chat({ onArtifactGenerated }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I am the Lenny Growth Assistant. Ask me anything about product growth or request a Ship 30 for 30 essay.'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage.content,
          llm_provider: 'local',
        }),
      });

      const data = await res.json();
      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }
      
      const assistantMessage: Message = { role: 'assistant', content: data.content };
      setMessages((prev) => [...prev, assistantMessage]);

      const artifactRegex = /```(html|markdown)[\s\S]*?```/g;
      const matches = data.content.match(artifactRegex);
      if (matches && matches.length > 0) {
          let artifactContent = matches[0];
          artifactContent = artifactContent.replace(/```(html|markdown)\n?/, '').replace(/```$/, '');
          onArtifactGenerated(artifactContent);
      }
      
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-fade-in" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            marginBottom: '24px',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '6px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: msg.role === 'user' ? 'var(--accent-gradient)' : '#2d3748',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: msg.role === 'user' ? '8px' : '0',
                marginRight: msg.role === 'user' ? '0' : '8px',
                fontSize: '12px', fontWeight: 'bold'
              }}>
                {msg.role === 'user' ? 'U' : 'L'}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {msg.role === 'user' ? 'You' : 'Lenny'}
              </span>
            </div>
            
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', 
              maxWidth: '85%',
              background: msg.role === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
              lineHeight: '1.5',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
            }}>
              {msg.role === 'user' ? (
                <div>{msg.content}</div>
              ) : (
                <div style={{ fontSize: '0.95rem' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2d3748', marginRight: '8px' }} />
            <div className="animate-pulse" style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a growth question..."
            style={{ 
              flex: 1, 
              padding: '14px 20px',
              paddingRight: '60px',
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <button type="submit" disabled={isLoading || !input.trim()} style={{ 
            position: 'absolute',
            right: '8px',
            top: '8px',
            bottom: '8px',
            padding: '0 20px', 
            background: isLoading || !input.trim() ? 'rgba(255,255,255,0.1)' : 'var(--accent-gradient)', 
            color: isLoading || !input.trim() ? 'var(--text-secondary)' : 'white', 
            border: 'none', 
            borderRadius: 'var(--radius-full)', 
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontWeight: 600
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(2px)' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
