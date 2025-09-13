import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TreePanel = ({ onVideoSelect }) => {
    const [leaves, setLeaves] = useState([]);
    const [bloomActive, setBloomActive] = useState(false);
    const [vines, setVines] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const leafParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            opacity: 0.6 + Math.random() * 0.4,
            type: Math.floor(Math.random() * 3), // Different leaf types
        }));
        setLeaves(leafParticles);

        // Update time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    // Bloom effect (like lightning but for nature)
    useEffect(() => {
        const bloomInterval = setInterval(() => {
            setBloomActive(true);
            setTimeout(() => setBloomActive(false), 400);
        }, 12000 + Math.random() * 8000);

        return () => clearInterval(bloomInterval);
    }, []);

    // Create vine growth effect on hover
    useEffect(() => {
        if (isHovered) {
            const vineGrowth = Array.from({ length: 8 }, (_, i) => ({
                id: Date.now() + i,
                startX: Math.random() * 100,
                startY: 100,
                growthDelay: i * 150,
                direction: Math.random() > 0.5 ? 1 : -1,
            }));
            setVines(vineGrowth);

            // Clear vines after animation
            const clearTimer = setTimeout(() => {
                setVines([]);
            }, 3000);

            return () => clearTimeout(clearTimer);
        } else {
            setVines([]);
        }
    }, [isHovered]);

    const handleClick = () => {
        setTimeout(() => {
            navigate('/if-i-could-speak');
        }, 300);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const caseStudies = [
        { id: 1, title: "Climate Resilience", progress: 95, type: "environmental" },
        { id: 2, title: "Urban Green Spaces", progress: 80, type: "community" },
        { id: 3, title: "Sustainable Agriculture", progress: 65, type: "innovation" },
        { id: 4, title: "Ocean Conservation", progress: 40, type: "marine" },
        { id: 5, title: "Renewable Energy", progress: 20, type: "technology" }
    ];

    return (
        <div
            style={{
                ...panelBase,
                background: `linear-gradient(135deg, 
      rgba(20, 50, 30, 0.85), 
      rgba(34, 85, 51, 0.8),
      rgba(25, 60, 35, 0.85),
      rgba(30, 70, 40, 0.9)
    )`,
                border: `2px solid rgba(144, 238, 144, 0.4)`,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflowX: 'hidden',   // ✅ prevents horizontal scroll
                overflowY: 'hidden',   // keeps animations inside vertically too
                backdropFilter: 'blur(12px)',
                width: '100%',
                height: '100%',
                minHeight: 'clamp(300px, 35vh, 450px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: bloomActive
                    ? '0 0 50px rgba(144, 238, 144, 0.9), inset 0 0 30px rgba(50, 205, 50, 0.4)'
                    : '0 15px 40px rgba(0,0,0,0.6), inset 0 0 25px rgba(34, 139, 34, 0.15)',
            }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(144, 238, 144, 0.7)';
                e.currentTarget.style.boxShadow = '0 20px 45px rgba(50, 205, 50, 0.4), inset 0 0 35px rgba(144, 238, 144, 0.2)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(144, 238, 144, 0.4)';
                e.currentTarget.style.boxShadow = bloomActive
                    ? '0 0 50px rgba(144, 238, 144, 0.9), inset 0 0 30px rgba(50, 205, 50, 0.4)'
                    : '0 15px 40px rgba(0,0,0,0.6), inset 0 0 25px rgba(34, 139, 34, 0.15)';
            }}
        >
            {/* Bloom flash overlay */}
            {bloomActive && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(144, 238, 144, 0.3)',
                        borderRadius: '12px',
                        pointerEvents: 'none',
                        animation: 'bloomFlash 0.4s ease-out',
                        zIndex: 1,
                    }}
                />
            )}

            {/* Floating leaves animation */}
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    style={{
                        position: 'absolute',
                        left: `${leaf.left}%`,
                        top: '-15px',
                        width: 'clamp(6px, 1.5vw, 10px)',
                        height: 'clamp(8px, 2vw, 12px)',
                        background: leaf.type === 0
                            ? 'linear-gradient(135deg, #90EE90, #32CD32)'
                            : leaf.type === 1
                                ? 'linear-gradient(135deg, #98FB98, #00FF7F)'
                                : 'linear-gradient(135deg, #ADFF2F, #7FFF00)',
                        borderRadius: leaf.type === 0
                            ? '0 100% 0 100%'
                            : leaf.type === 1
                                ? '50% 0 50% 100%'
                                : '100% 0 100% 0',
                        animation: `leafFloat ${leaf.duration}s linear infinite`,
                        animationDelay: `${leaf.delay}s`,
                        opacity: leaf.opacity,
                        pointerEvents: 'none',
                        zIndex: 2,
                        filter: 'drop-shadow(0 2px 4px rgba(50, 205, 50, 0.3))',
                    }}
                />
            ))}

            {/* Growing vines on hover */}
            {vines.map((vine) => (
                <div
                    key={vine.id}
                    style={{
                        position: 'absolute',
                        left: `${vine.startX}%`,
                        bottom: '0',
                        width: 'clamp(3px, 0.8vw, 4px)',
                        height: '0',
                        background: 'linear-gradient(to top, rgba(34, 139, 34, 0.9), rgba(144, 238, 144, 0.7))',
                        borderRadius: '2px 2px 0 0',
                        animation: `vineGrow 2s ease-out ${vine.growthDelay}ms forwards`,
                        transformOrigin: 'bottom',
                        pointerEvents: 'none',
                        zIndex: 3,
                    }}
                >
                    {/* Vine leaves */}
                    <div style={{
                        position: 'absolute',
                        top: '30%',
                        left: vine.direction > 0 ? '-4px' : '0px',
                        width: 'clamp(4px, 1vw, 6px)',
                        height: 'clamp(4px, 1vw, 6px)',
                        background: 'radial-gradient(circle, #90EE90, #32CD32)',
                        borderRadius: '0 100% 0 100%',
                        animation: `leafSprout 1s ease-out ${vine.growthDelay + 800}ms both`,
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '60%',
                        right: vine.direction > 0 ? '0px' : '-4px',
                        width: 'clamp(3px, 0.8vw, 5px)',
                        height: 'clamp(3px, 0.8vw, 5px)',
                        background: 'radial-gradient(circle, #98FB98, #00FF7F)',
                        borderRadius: '50% 0 50% 100%',
                        animation: `leafSprout 1s ease-out ${vine.growthDelay + 1200}ms both`,
                    }} />
                </div>
            ))}

            {/* Nature canopy overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '35%',
                    background: `linear-gradient(to bottom, 
            rgba(34, 85, 51, 0.4),
            rgba(25, 60, 35, 0.2),
            transparent
          )`,
                    borderRadius: '12px 12px 0 0',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            {/* Header Section */}
            <div style={{
                textAlign: 'center',
                padding: 'clamp(12px, 3vw, 20px)',
                position: 'relative',
                zIndex: 5,
                width: '100%',
                maxWidth: '100%'
            }}>
                {/* Time and Nature Display */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'clamp(12px, 3vw, 20px)',
                    color: 'rgba(144, 238, 144, 0.8)',
                    fontSize: 'clamp(0.6rem, 1.6vw, 0.75rem)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: 'clamp(6px, 1.5vw, 8px)',
                            height: 'clamp(6px, 1.5vw, 8px)',
                            background: 'rgba(144, 238, 144, 0.8)',
                            borderRadius: '50%',
                            animation: 'naturePulse 2s infinite'
                        }} />
                        ACTIVE
                    </div>
                    <div>{formatTime(currentTime)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🌿 Study Mode
                    </div>
                </div>

                {/* Main Nature Icons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(12px, 3vw, 20px)',
                    marginBottom: 'clamp(12px, 3vw, 20px)',
                    animation: 'iconGrow 3s infinite ease-in-out'
                }}>
                    {/* Tree Icon */}
                    <div
                        style={{
                            width: 'clamp(50px, 12vw, 70px)',
                            height: 'clamp(50px, 12vw, 70px)',
                            background: 'linear-gradient(135deg, rgba(34, 139, 34, 0.9), rgba(144, 238, 144, 1))',
                            borderRadius: '8px',
                            position: 'relative',
                            boxShadow: '0 6px 16px rgba(34, 139, 34, 0.5)',
                            animation: 'treeSway 4s infinite ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'clamp(20px, 5vw, 30px)',
                        }}
                    >
                        🌳
                        {/* Tree trunk */}
                        <div style={{
                            position: 'absolute',
                            bottom: 'clamp(8px, 2vw, 12px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'clamp(8px, 2vw, 12px)',
                            height: 'clamp(12px, 3vw, 18px)',
                            background: 'linear-gradient(to bottom, #8B4513, #A0522D)',
                            borderRadius: '0 0 2px 2px',
                        }} />
                    </div>

                    {/* Analysis Icon */}
                    <div
                        style={{
                            width: 'clamp(45px, 10vw, 60px)',
                            height: 'clamp(45px, 10vw, 60px)',
                            background: 'linear-gradient(135deg, rgba(50, 205, 50, 0.9), rgba(32, 178, 170, 1))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'clamp(18px, 4.5vw, 24px)',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 6px 16px rgba(50, 205, 50, 0.5)',
                            animation: 'analysisSpin 3s infinite ease-in-out',
                        }}
                    >
                        📊
                    </div>

                    {/* Growth Icon */}
                    <div
                        style={{
                            width: 'clamp(45px, 10vw, 60px)',
                            height: 'clamp(45px, 10vw, 60px)',
                            background: 'linear-gradient(135deg, rgba(127, 255, 0, 0.9), rgba(34, 139, 34, 1))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: '0 6px 16px rgba(127, 255, 0, 0.5)',
                            animation: 'growthExpand 3s infinite linear',
                        }}
                    >
                        <svg width="60%" height="60%" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="75, 100"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div style={{
                            position: 'absolute',
                            color: 'white',
                            fontSize: 'clamp(8px, 2vw, 10px)',
                            fontWeight: 'bold'
                        }}>
                            75%
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        color: '#32CD32',
                        fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                        fontWeight: 'bold',
                        marginBottom: 'clamp(6px, 1.5vw, 10px)',
                        textShadow: '0 0 20px rgba(50, 205, 50, 0.7)',
                        animation: 'textGlow 3s infinite ease-in-out',
                        letterSpacing: 'clamp(0.5px, 0.3vw, 2px)',
                        lineHeight: '1.2',
                    }}
                >
                    REAL-WORLD CASE STUDIES
                </div>

                <div style={{
                    color: '#90EE90',
                    fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                    marginBottom: 'clamp(12px, 3vw, 20px)',
                    opacity: 0.9,
                    lineHeight: '1.4',
                }}>
                    Explore sustainable solutions through documented success stories
                </div>
            </div>

            {/* Case Studies Preview Section */}
            <div style={{
                width: '100%',
                padding: '0 clamp(12px, 3vw, 20px)',
                position: 'relative',
                zIndex: 5,
            }}>
                <div style={{
                    background: 'rgba(34, 85, 51, 0.3)',
                    borderRadius: '10px',
                    padding: 'clamp(8px, 2vw, 12px)',
                    border: '1px solid rgba(144, 238, 144, 0.2)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
                        color: '#32CD32',
                        fontWeight: 'bold',
                        marginBottom: 'clamp(6px, 1.5vw, 10px)',
                        textAlign: 'center'
                    }}>
                        RESEARCH PROGRESS
                    </div>

                    {caseStudies.slice(0, 3).map((study, index) => (
                        <div key={study.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'clamp(4px, 1vw, 6px)',
                            padding: 'clamp(4px, 1vw, 6px)',
                            background: 'rgba(50, 205, 50, 0.1)',
                            borderRadius: '6px',
                            animation: `slideInGreen 0.5s ease-out ${index * 0.1}s both`
                        }}>
                            <div style={{
                                fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                                color: '#90EE90',
                                flex: 1,
                                textAlign: 'left'
                            }}>
                                {study.title}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <div style={{
                                    width: 'clamp(30px, 8vw, 40px)',
                                    height: 'clamp(2px, 0.5vw, 3px)',
                                    background: 'rgba(34, 85, 51, 0.5)',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${study.progress}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, #32CD32, #90EE90)`,
                                        borderRadius: '2px',
                                        animation: 'growthFill 1s ease-out'
                                    }} />
                                </div>
                                <span style={{
                                    fontSize: 'clamp(0.5rem, 1.3vw, 0.6rem)',
                                    color: '#32CD32',
                                    minWidth: 'clamp(20px, 5vw, 25px)',
                                    textAlign: 'right'
                                }}>
                                    {study.progress}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Status Section */}
            <div style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 20px)',
                position: 'relative',
                zIndex: 5,
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'clamp(8px, 2vw, 12px)',
                }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div
                            style={{
                                width: 'clamp(10px, 2.5vw, 14px)',
                                height: 'clamp(10px, 2.5vw, 14px)',
                                background: 'linear-gradient(135deg, #32CD32, #228B22)',
                                borderRadius: '50%',
                                margin: '0 auto 4px',
                                animation: 'seedGrow 1.5s infinite',
                                boxShadow: '0 0 10px rgba(50, 205, 50, 0.9)',
                            }}
                        />
                        <div style={{
                            color: '#32CD32',
                            fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
                            whiteSpace: 'nowrap'
                        }}>
                            GROWING
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div
                            style={{
                                width: 'clamp(10px, 2.5vw, 14px)',
                                height: 'clamp(10px, 2.5vw, 14px)',
                                background: 'linear-gradient(135deg, #90EE90, #32CD32)',
                                borderRadius: '50%',
                                margin: '0 auto 4px',
                                animation: 'seedGrow 2s infinite',
                                animationDelay: '0.7s',
                                boxShadow: '0 0 10px rgba(144, 238, 144, 0.9)',
                            }}
                        />
                        <div style={{
                            color: '#90EE90',
                            fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
                            whiteSpace: 'nowrap'
                        }}>
                            15 CASES
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div
                            style={{
                                width: 'clamp(10px, 2.5vw, 14px)',
                                height: 'clamp(10px, 2.5vw, 14px)',
                                background: 'linear-gradient(135deg, #7FFF00, #32CD32)',
                                borderRadius: '50%',
                                margin: '0 auto 4px',
                                animation: 'seedGrow 1.8s infinite',
                                animationDelay: '1.2s',
                                boxShadow: '0 0 10px rgba(127, 255, 0, 0.9)',
                            }}
                        />
                        <div style={{
                            color: '#7FFF00',
                            fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
                            whiteSpace: 'nowrap'
                        }}>
                            8 SOLUTIONS
                        </div>
                    </div>
                </div>

                {/* Enhanced Growth Progress Wave */}
                <div
                    style={{
                        background: 'rgba(34, 85, 51, 0.4)',
                        borderRadius: '12px',
                        height: 'clamp(6px, 1.5vw, 8px)',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid rgba(144, 238, 144, 0.3)',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #228B22, #32CD32, #90EE90, #32CD32, #228B22)',
                            borderRadius: '12px',
                            animation: 'waveGrowth 3s infinite ease-in-out',
                            width: '100%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent 0%, rgba(144, 238, 144, 0.3) 50%, transparent 100%)',
                            animation: 'shimmerGreen 2s infinite ease-in-out',
                        }}
                    />
                </div>

                <div style={{
                    color: '#32CD32',
                    fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                    marginTop: 'clamp(4px, 1vw, 6px)',
                    opacity: 0.9,
                    textAlign: 'center',
                    lineHeight: '1.2'
                }}>
                    Research Module: Growth Mode Activated 🌱
                </div>
            </div>

            {/* Floating nature elements */}
            <div
                style={{
                    position: 'absolute',
                    top: 'clamp(15px, 4vw, 25px)',
                    right: 'clamp(15px, 4vw, 25px)',
                    width: 'clamp(8px, 2vw, 12px)',
                    height: 'clamp(8px, 2vw, 12px)',
                    background: 'radial-gradient(circle, #32CD32, #228B22)',
                    borderRadius: '0 100% 0 100%',
                    animation: 'leafFloat1 4s infinite ease-in-out',
                    boxShadow: '0 0 8px rgba(50, 205, 50, 0.9)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 'clamp(15px, 4vw, 25px)',
                    left: 'clamp(15px, 4vw, 25px)',
                    width: 'clamp(6px, 1.5vw, 9px)',
                    height: 'clamp(6px, 1.5vw, 9px)',
                    background: 'radial-gradient(circle, #90EE90, #32CD32)',
                    borderRadius: '50% 0 50% 100%',
                    animation: 'leafFloat2 3.5s infinite ease-in-out',
                    animationDelay: '1.5s',
                    boxShadow: '0 0 6px rgba(144, 238, 144, 0.9)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'clamp(10px, 3vw, 15px)',
                    width: 'clamp(4px, 1vw, 6px)',
                    height: 'clamp(4px, 1vw, 6px)',
                    background: 'radial-gradient(circle, #7FFF00, #32CD32)',
                    borderRadius: '100% 0 100% 0',
                    animation: 'leafFloat3 4.5s infinite ease-in-out',
                    animationDelay: '2s',
                    boxShadow: '0 0 4px rgba(127, 255, 0, 0.9)',
                }}
            />

            <style jsx>{`
        @keyframes leafFloat {
          0% { 
            transform: translateY(-15px) rotate(0deg); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          50% {
            transform: translateY(50vh) rotate(180deg);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0; 
          }
        }

        @keyframes bloomFlash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes vineGrow {
          0% { 
            height: 0; 
            opacity: 0.8; 
          }
          100% { 
            height: clamp(60px, 15vh, 100px); 
            opacity: 1; 
          }
        }

        @keyframes leafSprout {
          0% { 
            transform: scale(0) rotate(0deg); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1) rotate(10deg); 
            opacity: 1; 
          }
        }

        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(50, 205, 50, 0.7), 0 0 30px rgba(50, 205, 50, 0.5);
          }
          50% { 
            text-shadow: 0 0 30px rgba(50, 205, 50, 1), 0 0 40px rgba(50, 205, 50, 0.7), 0 0 50px rgba(144, 238, 144, 0.5);
          }
        }

        @keyframes iconGrow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(50, 205, 50, 0.7), 0 0 30px rgba(50, 205, 50, 0.5);
          }
          50% { 
            text-shadow: 0 0 30px rgba(50, 205, 50, 1), 0 0 40px rgba(50, 205, 50, 0.7), 0 0 50px rgba(144, 238, 144, 0.5);
          }
        }

        @keyframes leafFloat1 {
          0% { opacity: 0.7; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(clamp(-15px, -4vw, -20px)) scale(1.1); }
          100% { opacity: 0.7; transform: translateY(0) scale(1); }
        }

        @keyframes leafFloat2 {
          0% { opacity: 0.7; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(clamp(-12px, -3vw, -18px)) scale(1.1); }
          100% { opacity: 0.7; transform: translateY(0) scale(1); }
        }

        @keyframes seedGrow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }

        @keyframes waveGrowth {
          0%, 100% { 
            transform: translateX(-20px); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }

        @keyframes shimmerGreen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes naturePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes slideInGreen {
          0% { opacity: 0; transform: translateX(-15px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes growthFill {
          0% { width: 0%; }
        }
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          @keyframes leafFloat {
            0% { 
              transform: translateY(-10px) rotate(0deg); 
              opacity: 0; 
            }
            10% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(calc(100vh + 20px)) rotate(360deg); 
              opacity: 0; 
            }
          }

          @keyframes vineGrow {
            0% { 
              height: 0; 
              opacity: 0.8; 
            }
            100% { 
              height: 40px; 
              opacity: 1; 
            }
          }

          @keyframes leafFloat1 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-15px) rotate(180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-30px) rotate(360deg) scale(0); }
          }

          @keyframes leafFloat2 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-12px) rotate(-180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-24px) rotate(-360deg) scale(0); }
          }

          @keyframes leafFloat3 {
            0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateX(8px) rotate(90deg) scale(1); }
            100% { opacity: 0; transform: translateX(16px) rotate(180deg) scale(0); }
          }
        }

        /* Tablet optimizations */
        @media (min-width: 481px) and (max-width: 768px) {
          @keyframes vineGrow {
            0% { 
              height: 0; 
              opacity: 0.8; 
            }
            100% { 
              height: 70px; 
              opacity: 1; 
            }
          }

          @keyframes leafFloat1 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-25px) rotate(180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) rotate(360deg) scale(0); }
          }

          @keyframes leafFloat2 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-20px) rotate(-180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) rotate(-360deg) scale(0); }
          }

          @keyframes leafFloat3 {
            0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateX(15px) rotate(90deg) scale(1); }
            100% { opacity: 0; transform: translateX(30px) rotate(180deg) scale(0); }
          }
        }

        /* Large desktop optimizations */
        @media (min-width: 1200px) {
          @keyframes vineGrow {
            0% { 
              height: 0; 
              opacity: 0.8; 
            }
            100% { 
              height: 100px; 
              opacity: 1; 
            }
          }

          @keyframes leafFloat1 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-30px) rotate(180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-60px) rotate(360deg) scale(0); }
          }

          @keyframes leafFloat2 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-25px) rotate(-180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) rotate(-360deg) scale(0); }
          }

          @keyframes leafFloat3 {
            0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateX(20px) rotate(90deg) scale(1); }
            100% { opacity: 0; transform: translateX(40px) rotate(180deg) scale(0); }
          }
        }
      `}</style>
        </div>
    );
};

const panelBase = {
    background: 'rgba(20, 50, 30, 0.6)',
    border: '1px solid rgba(144, 238, 144, 0.5)',
    borderRadius: '12px',
    padding: 'clamp(12px, 3vw, 18px)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'inset 0 0 25px rgba(34, 139, 34, 0.15), 0 15px 40px rgba(0,0,0,0.4)',
};

export default TreePanel;