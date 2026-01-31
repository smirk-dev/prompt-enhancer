/**
 * Magic Sparkle Prompt Engine
 * Popup UI - Extension settings and status
 */

import React from 'react';

import './style.css';

function IndexPopup() {
  return (
    <div
      style={{
        width: 320,
        padding: 16,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 4l-11 11 4 4 11-11-4-4z" />
            <path d="M18 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
          </svg>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Magic Sparkle
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
            Prompt Enhancement Engine
          </p>
        </div>
      </div>

      {/* Status Section */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4CAF50',
              boxShadow: '0 0 8px #4CAF50'
            }}
          />
          <span style={{ fontSize: 14 }}>Active & Ready</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
          The Magic Sparkle button will appear when you focus on a text input on supported LLM platforms.
        </p>
      </div>

      {/* Supported Platforms */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase' }}>
          Supported Platforms
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['ChatGPT', 'Claude', 'Gemini'].map((platform) => (
            <span
              key={platform}
              style={{
                padding: '4px 12px',
                background: 'rgba(0, 242, 255, 0.1)',
                border: '1px solid rgba(0, 242, 255, 0.3)',
                borderRadius: 20,
                fontSize: 12,
                color: '#00F2FF'
              }}
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcut */}
      <div
        style={{
          background: 'rgba(255, 215, 0, 0.1)',
          borderRadius: 8,
          padding: 12,
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13 }}>Enhance Prompt</span>
          <kbd
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'monospace',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            Alt + S
          </kbd>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: 11,
          color: '#666',
          textAlign: 'center'
        }}
      >
        v1.0.0 • All processing happens locally
      </div>
    </div>
  );
}

export default IndexPopup;
