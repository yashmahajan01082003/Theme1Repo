import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RainyPanel = ({ onVideoSelect }) => {
    const [raindrops, setRaindrops] = useState([]);
    const [lightningActive, setLightningActive] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const drops = Array.from({ length: 35 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 1 + Math.random() * 1.5,
            opacity: 0.4 + Math.random() * 0.5,
        }));
        setRaindrops(drops);

        // Update time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    // Lightning effect
    useEffect(() => {
        const lightningInterval = setInterval(() => {
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 200);
        }, 8000 + Math.random() * 5000);

        return () => clearInterval(lightningInterval);
    }, []);

    // Create ripple effect on click
    const createRipple = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newRipple = {
            id: Date.now(),
            x,
            y,
        };

        setRipples(prev => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 1000);
    };

    const handleClick = (e) => {
        createRipple(e);
        setTimeout(() => {
            navigate('/if-i-could-speak');
        }, 300);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const lessons = [
        { id: 1, title: "Understanding Situations", progress: 100, type: "video" },
        { id: 2, title: "Rainfall Patterns", progress: 75, type: "interactive" },
        { id: 3, title: "Oreographic rainfall", progress: 50, type: "quiz" },
        { id: 4, title: "Self Expression", progress: 25, type: "video" },
        { id: 5, title: "Active Listening", progress: 0, type: "audio" }
    ];

    return (
        <div
            style={{
                ...panelBase,
                background: `linear-gradient(135deg, 
          rgba(8, 16, 28, 0.85), 
          rgba(12, 24, 42, 0.8),
          rgba(16, 28, 48, 0.85),
          rgba(10, 20, 35, 0.9)
        )`,
                border: `2px solid rgba(30, 60, 100, 0.4)`,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(12px)',
                width: '100%',
                height: '100%',
                minHeight: 'clamp(300px, 35vh, 450px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: lightningActive
                    ? '0 0 50px rgba(70, 130, 200, 0.9), inset 0 0 30px rgba(70, 130, 200, 0.4)'
                    : '0 15px 40px rgba(0,0,0,0.6), inset 0 0 25px rgba(30, 60, 100, 0.15)',
            }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(70, 130, 200, 0.7)';
                e.currentTarget.style.boxShadow = '0 20px 45px rgba(30, 60, 100, 0.4), inset 0 0 35px rgba(70, 130, 200, 0.2)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(30, 60, 100, 0.4)';
                e.currentTarget.style.boxShadow = lightningActive
                    ? '0 0 50px rgba(70, 130, 200, 0.9), inset 0 0 30px rgba(70, 130, 200, 0.4)'
                    : '0 15px 40px rgba(0,0,0,0.6), inset 0 0 25px rgba(30, 60, 100, 0.15)';
            }}
        >
            {/* Lightning flash overlay */}
            {lightningActive && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(70, 130, 200, 0.3)',
                        borderRadius: '12px',
                        pointerEvents: 'none',
                        animation: 'lightningFlash 0.2s ease-out',
                        zIndex: 1,
                    }}
                />
            )}

            {/* Rain animation */}
            {raindrops.map((drop) => (
                <div
                    key={drop.id}
                    style={{
                        position: 'absolute',
                        left: `${drop.left}%`,
                        top: '-10px',
                        width: 'clamp(1px, 0.3vw, 2px)',
                        height: 'clamp(15px, 4vw, 25px)',
                        background: 'linear-gradient(to bottom, rgba(70, 130, 200, 0.9), rgba(70, 130, 200, 0.4))',
                        borderRadius: '0 0 50% 50%',
                        animation: `rainFall ${drop.duration}s linear infinite`,
                        animationDelay: `${drop.delay}s`,
                        opacity: drop.opacity,
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
            ))}

            {/* Water ripples */}
            {ripples.map((ripple) => (
                <div
                    key={ripple.id}
                    style={{
                        position: 'absolute',
                        left: `${ripple.x}%`,
                        top: `${ripple.y}%`,
                        width: 'clamp(8px, 2vw, 10px)',
                        height: 'clamp(8px, 2vw, 10px)',
                        border: '2px solid rgba(70, 130, 200, 0.7)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'rippleEffect 1s ease-out forwards',
                        pointerEvents: 'none',
                        zIndex: 3,
                    }}
                />
            ))}

            {/* Storm cloud overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '35%',
                    background: `linear-gradient(to bottom, 
            rgba(20, 30, 45, 0.4),
            rgba(25, 35, 50, 0.2),
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
                {/* Time and Weather Display */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'clamp(12px, 3vw, 20px)',
                    color: 'rgba(70, 130, 200, 0.8)',
                    fontSize: 'clamp(0.6rem, 1.6vw, 0.75rem)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: 'clamp(6px, 1.5vw, 8px)',
                            height: 'clamp(6px, 1.5vw, 8px)',
                            background: 'rgba(70, 130, 200, 0.8)',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                        }} />
                        LIVE
                    </div>
                    <div>{formatTime(currentTime)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⛈️ Learning Mode
                    </div>
                </div>

                {/* Main Icons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(12px, 3vw, 20px)',
                    marginBottom: 'clamp(12px, 3vw, 20px)',
                    animation: 'iconFloat 3s infinite ease-in-out'
                }}>
                    {/* Book Icon */}
                    <div
                        style={{
                            width: 'clamp(50px, 12vw, 70px)',
                            height: 'clamp(38px, 9vw, 52px)',
                            background: 'linear-gradient(135deg, rgba(70, 130, 200, 0.9), rgba(30, 80, 150, 1))',
                            borderRadius: '8px 12px 8px 8px',
                            position: 'relative',
                            boxShadow: '0 6px 16px rgba(30, 80, 150, 0.5)',
                            animation: 'bookPage 4s infinite ease-in-out',
                        }}
                    >
                        {/* Book pages */}
                        <div style={{
                            position: 'absolute',
                            top: 'clamp(6px, 1.8vw, 10px)',
                            left: 'clamp(6px, 1.8vw, 10px)',
                            right: 'clamp(6px, 1.8vw, 10px)',
                            height: 'clamp(2px, 0.6vw, 4px)',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '1px',
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: 'clamp(12px, 3.5vw, 18px)',
                            left: 'clamp(6px, 1.8vw, 10px)',
                            right: 'clamp(8px, 2.5vw, 14px)',
                            height: 'clamp(1px, 0.4vw, 2px)',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '1px',
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: 'clamp(18px, 5vw, 28px)',
                            left: 'clamp(6px, 1.8vw, 10px)',
                            right: 'clamp(10px, 3vw, 18px)',
                            height: 'clamp(1px, 0.4vw, 2px)',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '1px',
                        }} />
                    </div>

                    {/* Quiz Icon */}
                    <div
                        style={{
                            width: 'clamp(45px, 10vw, 60px)',
                            height: 'clamp(45px, 10vw, 60px)',
                            background: 'linear-gradient(135deg, rgba(50, 100, 180, 0.9), rgba(25, 70, 140, 1))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'clamp(20px, 5vw, 28px)',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 6px 16px rgba(25, 70, 140, 0.5)',
                            animation: 'quizPulse 2s infinite ease-in-out',
                        }}
                    >
                        ?
                    </div>

                    {/* Progress Icon */}
                    <div
                        style={{
                            width: 'clamp(45px, 10vw, 60px)',
                            height: 'clamp(45px, 10vw, 60px)',
                            background: 'linear-gradient(135deg, rgba(40, 90, 170, 0.9), rgba(20, 60, 130, 1))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: '0 6px 16px rgba(20, 60, 130, 0.5)',
                            animation: 'progressRotate 3s infinite linear',
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
                                strokeDasharray="60, 100"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div style={{
                            position: 'absolute',
                            color: 'white',
                            fontSize: 'clamp(8px, 2vw, 10px)',
                            fontWeight: 'bold'
                        }}>
                            60%
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        color: '#4682b4',
                        fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                        fontWeight: 'bold',
                        marginBottom: 'clamp(6px, 1.5vw, 10px)',
                        textShadow: '0 0 20px rgba(70, 130, 180, 0.7)',
                        animation: 'textRipple 3s infinite ease-in-out',
                        letterSpacing: 'clamp(0.5px, 0.3vw, 2px)',
                        lineHeight: '1.2',
                    }}
                >
                    INTERACTIVE LESSONS & QUIZ
                </div>

                <div style={{
                    color: '#6699cc',
                    fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                    marginBottom: 'clamp(12px, 3vw, 20px)',
                    opacity: 0.9,
                    lineHeight: '1.4',
                }}>
                    Master emotional intelligence through immersive learning
                </div>
            </div>

            {/* Lessons Preview Section */}
            <div style={{
                width: '100%',
                padding: '0 clamp(12px, 3vw, 20px)',
                position: 'relative',
                zIndex: 5,
            }}>
                <div style={{
                    background: 'rgba(20, 40, 70, 0.3)',
                    borderRadius: '10px',
                    padding: 'clamp(8px, 2vw, 12px)',
                    border: '1px solid rgba(70, 130, 200, 0.2)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
                        color: '#4682b4',
                        fontWeight: 'bold',
                        marginBottom: 'clamp(6px, 1.5vw, 10px)',
                        textAlign: 'center'
                    }}>
                        CURRENT PROGRESS
                    </div>

                    {lessons.slice(0, 3).map((lesson, index) => (
                        <div key={lesson.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'clamp(4px, 1vw, 6px)',
                            padding: 'clamp(4px, 1vw, 6px)',
                            background: 'rgba(30, 60, 100, 0.2)',
                            borderRadius: '6px',
                            animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }}>
                            <div style={{
                                fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                                color: '#6699cc',
                                flex: 1,
                                textAlign: 'left'
                            }}>
                                {lesson.title}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <div style={{
                                    width: 'clamp(30px, 8vw, 40px)',
                                    height: 'clamp(2px, 0.5vw, 3px)',
                                    background: 'rgba(20, 40, 70, 0.5)',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${lesson.progress}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, #4682b4, #6699cc)`,
                                        borderRadius: '2px',
                                        animation: 'progressFill 1s ease-out'
                                    }} />
                                </div>
                                <span style={{
                                    fontSize: 'clamp(0.5rem, 1.3vw, 0.6rem)',
                                    color: '#4682b4',
                                    minWidth: 'clamp(20px, 5vw, 25px)',
                                    textAlign: 'right'
                                }}>
                                    {lesson.progress}%
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
                                background: 'linear-gradient(135deg, #4682b4, #1e4682)',
                                borderRadius: '50%',
                                margin: '0 auto 4px',
                                animation: 'raindropBlink 1.5s infinite',
                                boxShadow: '0 0 10px rgba(70, 130, 180, 0.9)',
                            }}
                        />
                        <div style={{
                            color: '#4682b4',
                            fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
                            whiteSpace: 'nowrap'
                        }}>
                            READY
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div
                            style={{
                                width: 'clamp(10px, 2.5vw, 14px)',
                                height: 'clamp(10px, 2.5vw, 14px)',
                                background: 'linear-gradient(135deg, #6699cc, #336699)',
                                borderRadius: '50%',
                                margin: '0 auto 4px',
                                animation: 'raindropBlink 2s infinite',
                                animationDelay: '0.7s',
                                boxShadow: '0 0 10px rgba(102, 153, 204, 0.9)',
                            }}
                        />
                        <div style={{
                            color: '#6699cc',
                            fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
                            whiteSpace: 'nowrap'
                        }}>
                            12 LESSONS
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div
                            style={{
                                width: 'clamp(10px, 2.5vw, 14px)',
                                height: 'clamp(10px, 2.5vw, 14px)',
                                background: 'linear-gradient(135deg, #5588bb, #2d5aa0)',
                                borderRadius: '50%',
                                margin: '0 auto 4px',
                                animation: 'raindropBlink 1.8s infinite',
                                animationDelay: '1.2s',
                                boxShadow: '0 0 10px rgba(85, 136, 187, 0.9)',
                            }}
                        />
                        <div style={{
                            color: '#5588bb',
                            fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
                            whiteSpace: 'nowrap'
                        }}>
                            5 QUIZ
                        </div>
                    </div>
                </div>

                {/* Enhanced Progress Wave */}
                <div
                    style={{
                        background: 'rgba(20, 40, 70, 0.4)',
                        borderRadius: '12px',
                        height: 'clamp(6px, 1.5vw, 8px)',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid rgba(70, 130, 200, 0.3)',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #1e4682, #4682b4, #6699cc, #4682b4, #1e4682)',
                            borderRadius: '12px',
                            animation: 'waveProgress 3s infinite ease-in-out',
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
                            background: 'linear-gradient(90deg, transparent 0%, rgba(70, 130, 200, 0.3) 50%, transparent 100%)',
                            animation: 'shimmer 2s infinite ease-in-out',
                        }}
                    />
                </div>

                <div style={{
                    color: '#4682b4',
                    fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                    marginTop: 'clamp(4px, 1vw, 6px)',
                    opacity: 0.9,
                    textAlign: 'center',
                    lineHeight: '1.2'
                }}>
                    Learning Module: Storm Mode Active ⚡
                </div>
            </div>

            {/* Floating water drops */}
            <div
                style={{
                    position: 'absolute',
                    top: 'clamp(15px, 4vw, 25px)',
                    right: 'clamp(15px, 4vw, 25px)',
                    width: 'clamp(6px, 1.5vw, 8px)',
                    height: 'clamp(6px, 1.5vw, 8px)',
                    background: 'radial-gradient(circle, #4682b4, #1e4682)',
                    borderRadius: '50%',
                    animation: 'waterDrop1 4s infinite ease-in-out',
                    boxShadow: '0 0 8px rgba(70, 130, 180, 0.9)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 'clamp(15px, 4vw, 25px)',
                    left: 'clamp(15px, 4vw, 25px)',
                    width: 'clamp(4px, 1vw, 6px)',
                    height: 'clamp(4px, 1vw, 6px)',
                    background: 'radial-gradient(circle, #6699cc, #336699)',
                    borderRadius: '50%',
                    animation: 'waterDrop2 3.5s infinite ease-in-out',
                    animationDelay: '1.5s',
                    boxShadow: '0 0 6px rgba(102, 153, 204, 0.9)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'clamp(10px, 3vw, 15px)',
                    width: 'clamp(3px, 0.8vw, 4px)',
                    height: 'clamp(3px, 0.8vw, 4px)',
                    background: 'radial-gradient(circle, #5588bb, #2d5aa0)',
                    borderRadius: '50%',
                    animation: 'waterDrop3 4.5s infinite ease-in-out',
                    animationDelay: '2s',
                    boxShadow: '0 0 4px rgba(85, 136, 187, 0.9)',
                }}
            />

            <style jsx>{`
        @keyframes rainFall {
          0% { 
            transform: translateY(-20px); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(calc(100vh + 50px)); 
            opacity: 0; 
          }
        }

        @keyframes lightningFlash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes rippleEffect {
          0% { 
            width: clamp(8px, 2vw, 10px); 
            height: clamp(8px, 2vw, 10px); 
            opacity: 1; 
          }
          100% { 
            width: clamp(50px, 12vw, 70px); 
            height: clamp(50px, 12vw, 70px); 
            opacity: 0; 
          }
        }

        @keyframes textRipple {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(70, 130, 180, 0.7), 0 0 30px rgba(70, 130, 180, 0.5);
          }
          50% { 
            text-shadow: 0 0 30px rgba(70, 130, 180, 1), 0 0 40px rgba(70, 130, 180, 0.7), 0 0 50px rgba(70, 130, 180, 0.5);
          }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes bookPage {
          0%, 100% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(-10deg) scale(1.05); }
        }

        @keyframes quizPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }

        @keyframes progressRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes waterDrop1 {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; transform: translateY(clamp(-20px, -5vw, -30px)) scale(1); }
          100% { opacity: 0; transform: translateY(clamp(-40px, -10vw, -60px)) scale(0); }
        }

        @keyframes waterDrop2 {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; transform: translateY(clamp(-15px, -4vw, -25px)) scale(1); }
          100% { opacity: 0; transform: translateY(clamp(-30px, -8vw, -50px)) scale(0); }
        }

        @keyframes waterDrop3 {
          0% { opacity: 0; transform: translateX(0) scale(0); }
          50% { opacity: 1; transform: translateX(clamp(10px, 3vw, 20px)) scale(1); }
          100% { opacity: 0; transform: translateX(clamp(20px, 6vw, 40px)) scale(0); }
        }

        @keyframes raindropBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }

        @keyframes waveProgress {
          0%, 100% { 
            transform: translateX(-30px); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes progressFill {
          0% { width: 0%; }
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          @keyframes rainFall {
            0% { 
              transform: translateY(-15px); 
              opacity: 0; 
            }
            10% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(calc(100vh + 30px)); 
              opacity: 0; 
            }
          }

          @keyframes waterDrop1 {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-15px) scale(1); }
            100% { opacity: 0; transform: translateY(-30px) scale(0); }
          }

          @keyframes waterDrop2 {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-12px) scale(1); }
            100% { opacity: 0; transform: translateY(-24px) scale(0); }
          }

          @keyframes waterDrop3 {
            0% { opacity: 0; transform: translateX(0) scale(0); }
            50% { opacity: 1; transform: translateX(8px) scale(1); }
            100% { opacity: 0; transform: translateX(16px) scale(0); }
          }
        }

        /* Tablet optimizations */
        @media (min-width: 481px) and (max-width: 768px) {
          @keyframes waterDrop1 {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-25px) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(0); }
          }

          @keyframes waterDrop2 {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) scale(0); }
          }

          @keyframes waterDrop3 {
            0% { opacity: 0; transform: translateX(0) scale(0); }
            50% { opacity: 1; transform: translateX(15px) scale(1); }
            100% { opacity: 0; transform: translateX(30px) scale(0); }
          }
        }

        /* Large desktop optimizations */
        @media (min-width: 1200px) {
          @keyframes waterDrop1 {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-30px) scale(1); }
            100% { opacity: 0; transform: translateY(-60px) scale(0); }
          }

          @keyframes waterDrop2 {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-25px) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(0); }
          }

          @keyframes waterDrop3 {
            0% { opacity: 0; transform: translateX(0) scale(0); }
            50% { opacity: 1; transform: translateX(20px) scale(1); }
            100% { opacity: 0; transform: translateX(40px) scale(0); }
          }
        }
      `}</style>
        </div>
    );
};

const panelBase = {
    background: 'rgba(8, 16, 28, 0.6)',
    border: '1px solid rgba(30, 60, 100, 0.5)',
    borderRadius: '12px',
    padding: 'clamp(12px, 3vw, 18px)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'inset 0 0 25px rgba(30, 60, 100, 0.15), 0 15px 40px rgba(0,0,0,0.4)',
};

export default RainyPanel;