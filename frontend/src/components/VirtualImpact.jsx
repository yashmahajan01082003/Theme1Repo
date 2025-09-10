// src/components/VirtualImpact.jsx
import React from 'react';
import { panelBase } from '../assets/Constants';

const impacts = [
  { name: 'Air Purified', value: '1,200 L', action: () => { } },
  { name: 'Carbon Reduced', value: '450 g', action: () => { } },
  { name: 'Trees Saved', value: '3', action: () => { } },
  { name: 'Toxic Waste Removed', value: '75 g', action: () => { } },
  { name: 'PlaceHolder', value: '75 g', action: () => { } },
];

const VirtualImpact = ({playHover, playAction}) => {
  return (
    <div
      style={{ ...panelBase, display: 'flex', flexDirection: 'column', minHeight: 0 }}
      className="w-full max-w-md sm:max-w-lg md:max-w-xl"
    >
      {/* Header */}
      <div
        style={{
          color: '#b9d6b6',
          fontSize: '1em',
          marginBottom: '20px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          borderBottom: '2px solid rgba(60, 110, 70, 0.35)',
          paddingBottom: '8px',
        }}
      >
        Virtual Impact You Made
      </div>

      {/* Scrollable list */}
      <div
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          maxHeight: '100%',
          paddingRight: 6,
        }}
      >
        {impacts.map((impact, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => {
              playAction();
              impact.action();
            }}
            onMouseEnter={playHover}
            onFocus={playHover}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playAction();
                impact.action();
              }
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 8px',
              borderBottom: '1px solid rgba(60, 110, 70, 0.22)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              borderRadius: '6px',
              outline: 'none',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(60, 110, 70, 0.12)';
              e.currentTarget.style.transform = 'translateX(2px)';
              e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(150,180,160,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ color: '#b9d6b6', fontSize: '0.9em' }}>{impact.name}</span>
            <span style={{ color: '#7db07f', fontWeight: 'bold' }}>{impact.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualImpact;
