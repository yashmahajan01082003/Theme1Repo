// src/components/Footer.jsx
import React from 'react'
import { footerContent } from '../../assets/Constants';

const TrialFooter = ({
        playHover, 
        playAction,
        FooterBackground,
        FooterBorder,
        ItemColor,
        ItmeMouseOverBackground,
        ItmeMouseOverBorder
    }) => {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px',
        background: `${FooterBackground}`,
        border: `1px solid ${FooterBorder}`,
        borderRadius: '10px',
        gap: '8px',
      }}
    >
      {[
        { label: 'Health Status', value: '47%' },
        { label: 'Radiation Level', value: '156°' },
        { label: 'Time in Zone', value: '23:42' },
        { label: 'Air Quality', value: 'CRITICAL' },
      ].map((item, i) => (
        <div
          key={i}
          onMouseEnter={playHover}
          style={{
            textAlign: 'center',
            color: `${ItemColor}`,
            fontSize: '0.6em',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            flex: 1,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = `${ItmeMouseOverBackground}`;
            e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.border = `1px solid ${ItmeMouseOverBorder}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = 'none';
          }}
        >
          <span
            style={{
              fontSize: '1.05em',
              fontWeight: 'bold',
              display: 'block',
              marginBottom: '2px',
            }}
          >
            {item.value}
          </span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default TrialFooter;