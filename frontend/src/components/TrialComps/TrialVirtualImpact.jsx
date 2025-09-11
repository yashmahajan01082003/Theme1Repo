// src/components/VirtualImpact.jsx
import React from 'react';
import { heading1, heading2, panelBase, panelBase2, superim, superimHeading } from '../../assets/Constants';

const impacts = [
  { name: 'Air Purified', value: '1,200 L', action: () => { } },
  { name: 'Carbon Reduced', value: '450 g', action: () => { } },
  { name: 'Trees Saved', value: '3', action: () => { } },
  { name: 'Toxic Waste Removed', value: '75 g', action: () => { } },
  { name: 'PlaceHolder', value: '75 g', action: () => { } },
];

const TrailVirtualImpact = ({ 
    playHover, 
    playAction, 
    themeno,
    impactcolor, 
    RowBottomBorderColor,
    MouseOverBackground,
    MouseOverBoxshadowColor
 }) => {
  return (
    <div
      style={{ ...superim[themeno], display: 'flex', flexDirection: 'column', minHeight: 0 }}
      className="w-full max-w-md sm:max-w-lg md:max-w-xl"
    >
      {/* Header */}
      <div
        style={{...superimHeading[themeno], textAlign:'center'}}
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
              borderBottom: `1px solid ${RowBottomBorderColor}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              borderRadius: '6px',
              outline: 'none',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = `${MouseOverBackground}`;
              e.currentTarget.style.transform = 'translateX(2px)';
              e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${MouseOverBoxshadowColor}`;
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
            <span style={{ color:`${impactcolor}`, fontSize: '0.9em' }}>{impact.name}</span>
            <span style={{ color: `${impactcolor}`, fontWeight: 'bold' }}>{impact.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailVirtualImpact;
