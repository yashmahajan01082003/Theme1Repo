import React from 'react';
import { X } from 'lucide-react';

const Header = ({ onClose, onUnmute, isMuted, playHover, playAction }) => {
  return (
    <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '10px 12px',
                background: 'rgba(0, 15, 0, 0.5)',
                border: '1px solid rgba(60, 110, 70, 0.45)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <button
                onClick={async () => {
                  await unmute();
                  playAction();
                }}
                onMouseEnter={playHover}
                title={isMuted ? 'Enable ambient audio' : 'Audio enabled'}
                style={{
                  background: isMuted ? 'rgba(60, 110, 70, 0.35)' : 'rgba(80, 140, 90, 0.55)',
                  border: '1px solid rgba(90, 150, 100, 0.5)',
                  color: '#b9d6b6',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  outline: 'none',
                  boxShadow: '0 0 0 0 rgba(150, 200, 160, 0.25)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.35), 0 0 0 2px rgba(150, 200, 160, 0.2) inset';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(150, 200, 160, 0.25)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(150, 200, 160, 0.4) inset';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(150, 200, 160, 0.25)';
                }}
              >
                {isMuted ? 'UNMUTE AMBIENT' : 'AUDIO: ON'}
              </button>
    
              <div>
                <h1
                  style={{
                    color: '#b9d6b6',
                    fontSize: '1.2em',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    letterSpacing: '2px',
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  WASTELAND SURVIVOR
                </h1>
                <div style={{ color: '#7ea17e', fontSize: '0.8em', opacity: 0.85 }}>
                  Environmental Impact Tracker
                </div>
              </div>
              <button
                onClick={() => {
                  playAction();
                  onClose();
                }}
                onMouseEnter={playHover}
                title="Close"
                style={{
                  background: 'rgba(60, 110, 70, 0.55)',
                  border: '1px solid rgba(60, 110, 70, 0.6)',
                  color: '#b9d6b6',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  outline: 'none',
                  boxShadow: '0 0 0 0 rgba(150, 200, 160, 0.25)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.35), 0 0 0 2px rgba(150, 200, 160, 0.2) inset';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(150, 200, 160, 0.25)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(150, 200, 160, 0.4) inset';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(150, 200, 160, 0.25)';
                }}
              >
                <X size={16} />
                CLOSE
              </button>
            </div>
  );
};

export default Header;
