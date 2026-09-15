"use client";
import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface ArtifactViewerProps {
  content: string;
}

export default function ArtifactViewer({ content }: ArtifactViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && content) {
      const sanitizedHTML = DOMPurify.sanitize(content);
      
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        // Inject a base styling wrapper so raw HTML doesn't look ugly
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; background: #fff; padding: 20px; line-height: 1.6; }
                h1, h2, h3 { color: #111; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px; }
                code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
                pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
                a { color: #0070f3; text-decoration: none; }
                a:hover { text-decoration: underline; }
                ul, ol { padding-left: 20px; margin-bottom: 16px; }
                blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 16px; color: #666; font-style: italic; }
              </style>
            </head>
            <body>
              ${sanitizedHTML}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [content]);

  if (!content) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', background: 'transparent' }}>
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-full)', marginBottom: '16px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <p style={{ fontSize: '0.95rem' }}>No artifact generated yet.</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>Ask the assistant to generate HTML or Markdown!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
      <iframe
        ref={iframeRef}
        title="Artifact Viewer"
        sandbox="allow-same-origin"
        style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
      />
    </div>
  );
}
