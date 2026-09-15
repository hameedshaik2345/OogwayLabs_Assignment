"use client";
import React, { useState } from 'react';
import Chat from '../components/Chat';
import ArtifactViewer from '../components/ArtifactViewer';

export default function Home() {
  const [artifactContent, setArtifactContent] = useState<string>('');

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', padding: '16px', gap: '16px' }}>
      
      {/* Left Panel: Chat Interface */}
      <div className="glass-panel" style={{ flex: '0 0 45%', minWidth: '400px', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: '#22c55e', 
            marginRight: '12px',
            boxShadow: '0 0 8px #22c55e'
          }} />
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.5px' }}>The Lenny Growth Assistant</h1>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Chat onArtifactGenerated={(content) => setArtifactContent(content)} />
        </div>
      </div>

      {/* Right Panel: Artifact Viewer */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            Artifact Viewer
          </h2>
          {artifactContent && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>Generated</span>}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ArtifactViewer content={artifactContent} />
        </div>
      </div>

    </div>
  );
}
