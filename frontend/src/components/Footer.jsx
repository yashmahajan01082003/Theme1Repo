// src/components/Footer.jsx
import React from 'react'
import { footerContent } from '../assets/Constants';

export const Footer = ({playHover, playAction}) => {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px',
        background: 'rgba(0, 10, 0, 0.4)',
        border: '1px solid rgba(50, 90, 60, 0.45)',
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
            color: '#a7b5a8',
            fontSize: '0.6em',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            flex: 1,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(60, 110, 70, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'rgba(120,180,130,0.3)';
            e.currentTarget.style.border = '1px solid rgba(120,180,130,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = 'none';
          }}
        >
          <span
            style={{
              color: item.label === 'Air Quality' && item.value === 'CRITICAL' ? '#ff6b6b' : '#7db07f',
              fontSize: '1.05em',
              fontWeight: 'bold',
              display: 'block',
              marginBottom: '2px',
              textShadow: item.label === 'Air Quality' && item.value === 'CRITICAL' ? '0 0 10px rgba(255,107,107,0.5)' : 'none',
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
