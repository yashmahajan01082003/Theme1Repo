import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from "lucide-react";
import { panelBase } from '../assets/Constants';

const getRankIcon = (position) => {
    if (position === 1) return <Trophy size={14} style={{ color: '#ffd700' }} />;
    if (position === 2) return <Medal size={14} style={{ color: '#c0c0c0' }} />;
    if (position === 3) return <Award size={14} style={{ color: '#cd7f32' }} />;
    return null;
};

const LeaderBoard = () => {
    const [selectedLevel, setSelectedLevel] = useState('class'); // 'class' or 'school'
    const [leaderboard, setLeaderboard] = useState({ class: [], school: [] });

    useEffect(() => {
        // Replace with your actual API endpoints for class and school leaderboard
        const fetchLeaderboard = async () => {
            try {
                const resClass = await fetch('http://127.0.0.1:8000/api/leaderboard/');
                const resSchool = await fetch('http://127.0.0.1:8000/api/leaderboard/');
                const dataClass = await resClass.json();
                const dataSchool = await resSchool.json();

                setLeaderboard({
                    class: dataClass.sort((a, b) => b.score - a.score),
                    school: dataSchool.sort((a, b) => b.score - a.score)
                });
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div style={{ ...panelBase, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Leaderboard Header */}
            <div
                style={{
                    color: '#b9d6b6',
                    fontSize: '0.9em',
                    marginBottom: '5px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    borderBottom: '2px solid rgba(60, 110, 70, 0.35)',
                    paddingBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={18} style={{ color: '#ffd966' }} />
                    Leaderboard
                </div>

                {/* Level Selector */}
                <div style={{ textAlign: 'center' }}>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(60, 110, 70, 0.4)',
                            background: 'rgba(20, 40, 25, 0.85)',
                            color: '#b9d6b6',
                            fontSize: '0.6em',
                            cursor: 'pointer',
                            outline: 'none',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <option
                            value="class"
                            style={{
                                background: '#203020',
                                color: '#b9d6b6',
                                fontSize: '0.75em',
                                padding: '8px',
                            }}
                        >
                            Class
                        </option>
                        <option
                            value="school"
                            style={{
                                background: '#203020',
                                color: '#b9d6b6',
                                fontSize: '0.75em',
                                padding: '8px',
                            }}
                        >
                            School
                        </option>
                    </select>
                </div>
            </div>

            {/* Enhanced Leaderboard List */}
            <div
                style={{
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    maxHeight: '100%',
                    paddingRight: 6,
                }}
            >
                {leaderboard[selectedLevel].map((student, index) => (
                        <div
                            key={student.name}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 10px',
                                margin: '10px 0',
                                borderBottom: index < 2 ? 'none' : '1px solid rgba(60, 110, 70, 0.22)',
                                background: index < 3 ?
                                    `linear-gradient(135deg, 
                          ${index === 0 ? 'rgba(255,215,0,0.1)' :
                                        index === 1 ? 'rgba(192,192,192,0.1)' :
                                            'rgba(205,127,50,0.1)'}, 
                          rgba(0,0,0,0.05))` :
                                    'transparent',
                                borderRadius: '8px',
                                border: index < 3 ?
                                    `1px solid ${index === 0 ? 'rgba(255,215,0,0.3)' :
                                        index === 1 ? 'rgba(192,192,192,0.3)' :
                                            'rgba(205,127,50,0.3)'}` :
                                    'none',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                            onMouseOver={(e) => {
                                if (index >= 3) {
                                    e.currentTarget.style.background = 'rgba(60, 110, 70, 0.12)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                    e.currentTarget.style.borderLeft = '3px solid rgba(120,180,130,0.6)';
                                } else {
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (index >= 3) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderLeft = 'none';
                                } else {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                    style={{
                                        minWidth: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: index < 3 ?
                                            `linear-gradient(135deg, 
                              ${index === 0 ? '#ffd700' :
                                                index === 1 ? '#c0c0c0' :
                                                    '#cd7f32'}, 
                              ${index === 0 ? '#ffed4a' :
                                                index === 1 ? '#e8e8e8' :
                                                    '#daa05e'})` :
                                            'rgba(60,110,70,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8em',
                                        fontWeight: 'bold',
                                        color: index < 3 ? '#000' : '#b9d6b6',
                                        boxShadow: index < 3 ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                                    }}
                                >
                                    {getRankIcon(index + 1) || (index + 1)}
                                </div>
                                <span
                                    style={{
                                        color: index < 3 ? '#fff' : '#b9d6b6',
                                        fontSize: '0.8em',
                                        fontWeight: index < 3 ? 'bold' : 'normal',
                                        textShadow: index < 3 ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
                                    }}
                                >
                                    {student.name}
                                </span>
                                {student.is_current_user && (
                                    <span
                                        style={{
                                            fontSize: '0.7em',
                                            background: 'rgba(120,180,130,0.3)',
                                            color: '#b9d6b6',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(120,180,130,0.4)',
                                        }}
                                    >
                                        YOU
                                    </span>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span
                                    style={{
                                        color: index < 3 ? '#fff' : '#7db07f',
                                        fontWeight: 'bold',
                                        fontSize: index < 3 ? '0.8em' : '0.7em',
                                        textShadow: index < 3 ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
                                    }}
                                >
                                    {student.points.toLocaleString()} XP
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default LeaderBoard