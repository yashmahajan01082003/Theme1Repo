import React from 'react';
import { X } from 'lucide-react';

const TrialHeader = ({ 
        onClose, 
        onUnmute, 
        isMuted, 
        playHover, 
        playAction,
        HeaderBackGround, 
        HeaderBorder,
        ButtonBackground,
        ButtonBorder,
        ButtonColor,
        ButtonMouseOverBoxshadow,
        Heading,
        HeadingColor,
        SubHeading,
        SubHeadingColor,
    }) => {
    return (
        <div
            style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '10px 12px',
                background: `${HeaderBackGround}`,
                border: `1px solid ${HeaderBorder}`,
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
                    background: `${ButtonBackground}`,
                    border: `1px solid ${ButtonBorder}`,
                    color: `${ButtonColor}`,
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
                    e.currentTarget.style.boxShadow = `${ButtonMouseOverBoxshadow}`;
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 0 rgba(150, 200, 160, 0.25)';
                }}
            >
                {isMuted ? 'UNMUTE AMBIENT' : 'AUDIO: ON'}
            </button>

            <div>
                <h1
                    style={{
                        color: `${HeadingColor}`,
                        fontSize: '1.2em',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                        letterSpacing: '2px',
                        margin: 0,
                        lineHeight: 1.1,
                    }}
                >
                    {Heading}
                </h1>
                <div style={{ color: `${SubHeadingColor}`, fontSize: '0.8em', opacity: 0.85 }}>
                    {SubHeading}
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
                    background: `${ButtonBackground}`,
                    border: `1px solid ${ButtonBorder}`,
                    color: `${ButtonColor}`,
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
            >
                <X size={16} />
                CLOSE
            </button>
        </div>
    );
};

export default TrialHeader;
