// src/components/ImpactStats.jsx
import React from 'react';
import { panelBase, impactstats } from '../assets/Constants';

const ImpactStats = () => {

    return (
        <div style={{ ...panelBase }}>
            <div
                style={{
                    color: '#b9d6b6',
                    fontSize: '1em',
                    marginBottom: '10px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    borderBottom: '2px solid rgba(60, 110, 70, 0.35)',
                    paddingBottom: '12px',
                }}
            >
                Impact Stats
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                    { label: 'Victims Heard', value: impactstats.victimsHeard },
                    { label: 'Disasters Faced', value: impactstats.disastersFaced },
                    { label: 'Lessons Learnt', value: impactstats.lessonsLearnt },
                    { label: 'Communities Helped', value: impactstats.communitiesHelped },
                    { label: 'Disasters Faced', value: impactstats.disastersFaced },
                ].map((item, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: 'rgba(0, 0, 0, 0.28)',
                            borderRadius: '10px',
                            border: '1px solid rgba(60, 110, 70, 0.3)',
                            transition:
                                'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                            cursor: 'pointer',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.borderColor = 'rgba(140,180,150,0.35)';
                            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.35)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.borderColor = 'rgba(60, 110, 70, 0.3)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span
                            style={{
                                color: '#a7b5a8',
                                fontSize: '0.8em',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}
                        >
                            {item.label}
                        </span>
                        <span
                            style={{
                                fontSize: '0.8em',
                                color: '#7db07f',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImpactStats;
