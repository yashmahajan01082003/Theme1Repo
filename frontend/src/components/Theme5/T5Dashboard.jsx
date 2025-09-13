// src/components/T5Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TrailVirtualImpact from '../TrialComps/TrialVirtualImpact.jsx';
import TrialCurrentRank from '../TrialComps/TrialCurrentRank.jsx';
import TrialImpactStats from '../TrialComps/TrialImpactStats.jsx';
import TrialLeaderBoard from '../TrialComps/TrialLeaderBoard.jsx';
import TrialLockedThemes from '../TrialComps/TrialLockedThemes.jsx';
import TrialHeader from '../TrialComps/TrialHeader.jsx';
import TrialFooter from '../TrialComps/TrialFooter.jsx';
import TreePanel from './TreePanel.jsx';

const useMachineNoise = (externalAudioRef = null) => {
    const audioRef = externalAudioRef || useRef(null);

    const ensureCtx = () => {
        if (!audioRef.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioRef.current = new AudioContextClass();
        }
        if (audioRef.current.state === 'suspended') {
            audioRef.current.resume();
        }
        return audioRef.current;
    };

    const playClick = (frequency = 180, durationMs = 90, gainValue = 0.08) => {
        try {
            const ctx = ensureCtx();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(frequency, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + durationMs / 1000 + 0.02);
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    };

    const playMechanicalBuzz = (durationMs = 140, gainValue = 0.06) => {
        try {
            const ctx = ensureCtx();
            const now = ctx.currentTime;

            const bufferSize = 2 * ctx.sampleRate;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * 0.6;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;

            const biquad = ctx.createBiquadFilter();
            biquad.type = 'bandpass';
            biquad.frequency.value = 800;
            biquad.Q.value = 1.4;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

            noise.connect(biquad).connect(gain).connect(ctx.destination);
            noise.start(now);
            noise.stop(now + durationMs / 1000 + 0.02);
        } catch (e) {
            console.warn('Mechanical buzz failed:', e);
        }
    };

    return useMemo(
        () => ({
            playHover: () => {
                playClick(160, 80, 0.07);
                playMechanicalBuzz(120, 0.05);
            },
            playAction: () => {
                playClick(220, 120, 0.09);
                playMechanicalBuzz(160, 0.07);
            },
        }),
        []
    );
};

const TreeDashboard = ({ onClose, onPlayVideo }) => {
    const [stats, setStats] = useState({
        scrapCoins: 2847,
        experience: 12340,
        areasCleaned: 28,
        pollutionUnits: 156,
        victimsHeard: 15,
        disastersFaced: 8,
        lessonsLearnt: 23,
    });
    const [particles, setParticles] = useState([]);

    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    const audioRef = useRef(null);
    const { playHover, playAction } = useMachineNoise(audioRef);
    
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Responsive breakpoints
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1200;
    const isDesktop = windowSize.width >= 1200;

    // Floating cherry blossom petals instead of leaves
    useEffect(() => {
        const createParticle = () => {
            const id = Math.random();
            const size = Math.random() * 6 + 4;
            const startPosition = Math.random() * window.innerWidth;
            const animationDuration = Math.random() * 2 + 4;
            const leafType = Math.floor(Math.random() * 3); // Different leaf shapes

            const newParticle = {
                id,
                size,
                left: startPosition,
                duration: animationDuration,
                leafType,
                rotation: Math.random() * 360
            };
            setParticles((prev) => [...prev, newParticle]);
            setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), animationDuration * 1000);
        };

        const interval = setInterval(createParticle, isMobile ? 2500 : 1800);
        return () => clearInterval(interval);
    }, [windowSize.width, isMobile]);

    // Dynamic stats update
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) => ({
                scrapCoins: Math.max(0, prev.scrapCoins + (Math.floor(Math.random() * 10) - 5)),
                experience: Math.max(0, prev.experience + (Math.floor(Math.random() * 10) - 5)),
                areasCleaned: Math.max(0, prev.areasCleaned + (Math.floor(Math.random() * 6) - 3)),
                pollutionUnits: Math.max(0, prev.pollutionUnits + (Math.floor(Math.random() * 8) - 4)),
                victimsHeard: Math.max(0, prev.victimsHeard + (Math.floor(Math.random() * 3) - 1)),
                disastersFaced: Math.max(0, prev.disastersFaced + (Math.floor(Math.random() * 2) - 1)),
                lessonsLearnt: Math.max(0, prev.lessonsLearnt + (Math.floor(Math.random() * 4) - 2)),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Loop ambient audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleEnded = () => { audio.currentTime = 0; audio.play(); };
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    // Add hover sound effects to interactive elements
    useEffect(() => {
        const addHoverEffects = () => {
            // Add hover effects to buttons and interactive elements
            const interactiveElements = document.querySelectorAll('button, .interactive, [role="button"]');

            const handleMouseEnter = (e) => {
                e.target.style.cursor = 'pointer';
                playHover();
            };

            const handleClick = () => {
                playAction();
            };

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('click', handleClick);
            });

            return () => {
                interactiveElements.forEach(el => {
                    el.removeEventListener('mouseenter', handleMouseEnter);
                    el.removeEventListener('click', handleClick);
                });
            };
        };

        // Delay to ensure DOM is ready
        const timer = setTimeout(addHoverEffects, 100);
        return () => clearTimeout(timer);
    }, [playHover, playAction]);

    // Grid layout configuration based on screen size
    const getGridConfig = () => {
        if (isMobile) {
            return {
                columns: '1fr',
                rows: 'auto auto auto auto auto auto auto',
                areas: '"header" "left-top" "left-bottom" "middle-top" "middle-bottom" "right-top" "right-bottom" "footer"'
            };
        } else if (isTablet) {
            return {
                columns: '1fr 1fr',
                rows: 'auto 1fr 1fr auto',
                areas: '"header header" "left middle" "right right" "footer footer"'
            };
        } else {
            return {
                columns: '1fr 1.4fr 1fr',
                rows: 'auto 1fr auto',
                areas: '"header header header" "left middle right" "footer footer footer"'
            };
        }
    };

    const gridConfig = getGridConfig();

    return (
        <div style={{
            fontFamily: "'Courier New', monospace",
            background: 'radial-gradient(1200px 600px at 50% 30%, rgba(0, 255, 85, 0.95), rgba(20, 50, 30, 0.98))', 
            color: '#fce4ec',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Floating cherry blossom petals */}
            {particles.map((p) => (
                <div key={p.id} style={{
                    position: 'absolute',
                    left: `${p.left}px`,
                    top: '-20px',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: p.petalType === 0
                        ? 'linear-gradient(135deg, #90EE90 0%, #32CD32 50%, #228B22 100%)'
                        : p.petalType === 1
                            ? 'linear-gradient(135deg, #98FB98 0%, #00FF7F 50%, #00CED1 100%)'
                            : p.petalType === 2
                                ? 'linear-gradient(135deg, #ADFF2F 0%, #7FFF00 50%, #32CD32 100%)'
                                : 'linear-gradient(135deg, #FFE4E1 0%, #91ff9eff 50%, #14ff24ff 100%)',
                    borderRadius: p.petalType === 0
                        ? '0 100% 0 100%'
                        : p.petalType === 1
                            ? '50% 0 50% 100%'
                            : p.petalType === 2
                                ? '50% 0 50% 100%'
                                : '100% 0 100% 0',
                    animation: `petalfall ${p.duration}s ease-in-out`,
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(50, 205, 50, 0.3)',
                    transform: `rotate(${p.rotation}deg)`,
                    filter: 'brightness(1.1) saturate(1.2)',
                    opacity: 0.9
                }} />
            ))}

            {/* Butterfly GIF in top left corner */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                animation: 'butterflyFloat 6s ease-in-out infinite'
            }}>
                <img
                    src="/assets/butterfly.gif"
                    alt="Butterfly"
                    style={{
                        width: 'clamp(40px, 8vw, 80px)',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 10px rgba(255, 223, 0, 0.4))'
                    }}
                />
            </div>
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 10,
            }}>
                <img
                    src="/assets/meow.gif"
                    alt="Butterfly"
                    style={{
                        width: 'clamp(80px, 15vw, 160px)',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 10px rgba(105, 255, 105, 0.6)) hue-rotate(100deg) saturate(1.3)'
                    }}
                />
            </div>

            {/* Butterfly GIF positioned near top of plant */}
            <div style={{
                position: 'absolute',
                bottom: 'clamp(120px, 20vw, 130px)', // Positioned relative to plant height
                right: 'clamp(20px, 4vw, 40px)', // Slightly offset from plant center
                zIndex: 11, // Higher z-index to appear above plant
                animation: 'butterflyFloat 6s ease-in-out infinite'
            }}>
                <img
                    src="/assets/butterfly.gif"
                    alt="Butterfly"
                    style={{
                        width: 'clamp(40px, 8vw, 80px)',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 10px rgba(255, 223, 0, 0.4))'
                    }}
                />
            </div>
            {/* PLant GIF in top right corner */}
            <div style={{
                position: 'absolute',
                bottom: '18px',
                right: '18px',
                zIndex: 10,
            }}>
                <img
                    src="/assets/Flower.gif"
                    alt="Butterfly"
                    
                    style={{
                        width: 'clamp(160px, 30vw, 300px)',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 10px rgba(255, 223, 0, 0.4))',
                        borderRadius:'12px'
                    }}
                />
            </div>

            {/* Background video with cherry blossom filter */}
            <video
                ref={videoRef}
                src="/assets/rain.mp4"
                autoPlay
                loop
                muted
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'brightness(0.5) saturate(1.6) hue-rotate(300deg) contrast(1.3)'
                }}
            />

            {/* Ambient audio */}
            <audio
                ref={audioRef}
                src="/assets/cherry.mp3"
                autoPlay
                loop
                muted={isMuted}
                style={{ display: 'none' }}
            />

            {/* Nature overlay with green tints */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(60, 179, 114, 0.56) 0%, rgba(34, 139, 34, 0.33) 50%, rgba(0, 100, 0, 0.38) 100%)',
                zIndex: 2,
                pointerEvents: 'none'
            }} />

            {/* Main dashboard - Responsive Grid */}
            <div
                className="dashboard-container"
                style={{
                    height: '100vh',
                    width: '100vw',
                    padding: isMobile ? '8px' : isTablet ? '12px' : '16px',
                    background: 'rgba(139, 69, 101, 0.4)',
                    border: '1px solid rgba(50, 90, 60, 0.35)',
                    display: 'grid',
                    gridTemplateColumns: gridConfig.columns,
                    gridTemplateRows: gridConfig.rows,
                    gridTemplateAreas: gridConfig.areas,
                    gap: isMobile ? '8px' : isTablet ? '12px' : '16px',
                    position: 'relative',
                    zIndex: 4,
                    overflow: isMobile ? 'auto' : 'hidden'
                }}
            >
                {/* Header */}
                <div style={{ gridArea: 'header' }}>
                    <TrialHeader
                        themeno={6}
                        isMuted={isMuted}
                        onUnmute={() => setIsMuted(false)}
                        onClose={onClose}
                        playHover={playHover}
                        playAction={playAction}
                        HeaderBackGround='linear-gradient(160deg, rgba(10,30,15,0.95), rgba(25,60,35,0.9))'
                        HeaderBorder='rgba(100,180,120,0.35)'
                        ButtonBackground='rgba(25,55,35,0.6)'
                        ButtonBorder='rgba(100,200,140,0.35)'
                        ButtonColor='#d8f5e0'
                        ButtonMouseOverBoxshadow='rgba(60,120,70,0.8)'
                        Heading='FOREST GUARDIAN'
                        SubHeading='Petal Growth & Harmony Tracker'
                        HeadingColor='#9ae6b4'
                        SubHeadingColor='#8fdb9b'
                    />
                </div>

                {/* Left Column Components */}
                {isMobile ? (
                    <>
                        <div style={{ gridArea: 'left-top' }}>
                            <TrialCurrentRank
                                themeno={5}
                                NameColor="#e8fbe8"
                                LevelColor="#b2f2bb"
                                RoleColor="#98fb98"
                                ProgresBarBackground='rgba(0, 40, 20, 0.6)'
                                ProgresBarBorder='rgba(144, 238, 144, 0.4)'
                                ProgresBarInnerBackground='linear-gradient(90deg, #228b22, #32cd32, #7fff00)'
                                XPColor='#b2f2bb'
                                StreakBackground='rgba(50, 205, 50, 0.25)'
                                StreakBoxShadow='rgba(50,205,50,0.3)'
                                StreakBorder='rgba(144, 238, 144, 0.4)'
                                StreakColor='#ffd966'
                            />
                        </div>
                        <div style={{ gridArea: 'left-bottom' }}>
                            <TrailVirtualImpact
                                playHover={playHover}
                                playAction={playAction}
                                themeno={5}
                                RowBottomBorderColor='rgba(120,200,140,0.15)'
                                MouseOverBackground='rgba(30,55,40,0.45)'
                                MouseOverBoxshadowColor='rgba(76,175,80,0.25)'
                                impactcolor='#e8f5e9'
                            />
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            gridArea: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isTablet ? '8px' : '12px',
                            minWidth: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            flex: '1',
                            minHeight: '200px',
                            overflow: 'auto'
                        }}>
                            <TrialCurrentRank
                                themeno={5}
                                    NameColor="#e8fbe8"
                                    LevelColor="#b2f2bb"
                                    RoleColor="#98fb98"
                                    ProgresBarBackground='rgba(0, 40, 20, 0.6)'
                                    ProgresBarBorder='rgba(144, 238, 144, 0.4)'
                                    ProgresBarInnerBackground='linear-gradient(90deg, #228b22, #32cd32, #7fff00)'
                                    XPColor='#b2f2bb'
                                    StreakBackground='rgba(50, 205, 50, 0.25)'
                                    StreakBoxShadow='rgba(50,205,50,0.3)'
                                    StreakBorder='rgba(144, 238, 144, 0.4)'
                                StreakColor='#ffd966'
                            />
                        </div>
                        <div style={{
                            flex: '1',
                            minHeight: '200px',
                            overflow: 'auto'
                        }}>
                            <TrailVirtualImpact
                                playHover={playHover}
                                playAction={playAction}
                                themeno={5}
                                    RowBottomBorderColor='rgba(120,200,140,0.15)'
                                    MouseOverBackground='rgba(30,55,40,0.45)'
                                    MouseOverBoxshadowColor='rgba(76,175,80,0.25)'
                                    impactcolor='#e8f5e9'
                            />
                        </div>
                    </div>
                )}

                {/* Middle Column Components */}
                {isMobile ? (
                    <>
                        <div style={{ gridArea: 'middle-top', minHeight: '300px' }}>
                            <TreePanel
                                onVideoSelect={onPlayVideo}
                                playHover={playHover}
                                playAction={playAction}
                            />
                        </div>
                        <div style={{ gridArea: 'middle-bottom', minHeight: '200px' }}>
                            <TrialLockedThemes
                                themeno={5}
                                ButtonBackground='rgba(20,35,25,0.85)'
                                ButtonBorder='rgba(120,200,140,0.5)'
                                ButtonColor='#a5f0b4'
                                ButtonMouseOverBackground='rgba(60,140,90,0.9)'
                                ButtonMouseOverBorder='rgba(160,240,180,0.7)'
                            />
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            gridArea: 'middle',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isTablet ? '8px' : '12px',
                            minWidth: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            flex: isTablet ? '1' : '1.5',
                            minHeight: '300px',
                            overflow: 'auto'
                        }}>
                            <TreePanel
                                onVideoSelect={onPlayVideo}
                                playHover={playHover}
                                playAction={playAction}
                            />
                        </div>
                        <div style={{
                            flex: '1',
                            minHeight: '150px',
                            overflow: 'auto'
                        }}>
                            <TrialLockedThemes
                                    themeno={5}
                                    ButtonBackground='rgba(20,35,25,0.85)'
                                    ButtonBorder='rgba(120,200,140,0.5)'
                                    ButtonColor='#a5f0b4'
                                    ButtonMouseOverBackground='rgba(60,140,90,0.9)'
                                    ButtonMouseOverBorder='rgba(160,240,180,0.7)'
                            />
                        </div>
                    </div>
                )}

                {/* Right Column Components */}
                {isMobile ? (
                    <>
                        <div style={{ gridArea: 'right-top', minHeight: '250px' }}>
                            <TrialLeaderBoard
                                themeno={5}
                                LevelBorder='rgba(90, 200, 78, 0.25)'
                                LevelBackground='rgba(192, 255, 196, 0.08)'
                                LevelColor='#b9d6b6'
                                OptionBackground='#203020'
                                OptionColor='#b9d6b6'
                                RowMouseOverBackground='rgba(25,45,35,0.35)'
                                RowMouseOverBorderLeft='rgba(120,200,140,0.4)'
                                RowRankNumberColor='#b9d6b6'
                                RowStudentNameColor='#cfe9d9'
                                RowStudentPointsColor='#88ff80ff'
                            />
                        </div>
                        <div style={{ gridArea: 'right-bottom', minHeight: '200px' }}>
                            <TrialImpactStats
                                themeno={5}
                                RowBackground='rgba(192, 255, 192, 0.08)'
                                RowBorder='rgba(182, 255, 194, 0.25)'
                                RowMouseOverBorderColor='rgba(182, 255, 183, 0.5)'
                                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                                ItemNameColor='#cfe9d9'
                                ItemValueColor='#4be686ff'
                            />
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            gridArea: 'right',
                            display: 'flex',
                            flexDirection: isTablet ? 'row' : 'column',
                            gap: isTablet ? '12px' : '12px',
                            minWidth: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            flex: '1',
                            minHeight: isTablet ? 'auto' : '200px',
                            overflow: 'auto',
                        }}>
                            <TrialLeaderBoard

                                themeno={5}
                                LevelBorder='rgba(90, 200, 78, 0.25)'
                                LevelBackground='rgba(192, 255, 196, 0.08)'
                                LevelColor='#b9d6b6'
                                OptionBackground='#203020'
                                OptionColor='#b9d6b6'
                                    RowMouseOverBackground='rgba(25,45,35,0.35)'
                                    RowMouseOverBorderLeft='rgba(120,200,140,0.4)'
                                RowRankNumberColor='#b9d6b6'
                                    RowStudentNameColor='#cfe9d9'
                                RowStudentPointsColor='#88ff80ff'
                            />
                        </div>
                        <div style={{
                            flex: '1',
                            minHeight: isTablet ? 'auto' : '200px',
                            overflow: 'auto'
                        }}>
                            <TrialImpactStats
                                themeno={5}
                                RowBackground='rgba(192, 255, 192, 0.08)'
                                RowBorder='rgba(182, 255, 194, 0.25)'
                                RowMouseOverBorderColor='rgba(182, 255, 183, 0.5)'
                                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                                    ItemNameColor='#cfe9d9'
                                    ItemValueColor='#4be686ff'
                            />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ gridArea: 'footer' }}>
                    <TrialFooter
                        playHover={playHover}
                        playAction={playAction}
                        FooterBackground='linear-gradient(160deg, rgba(10,25,15,0.95), rgba(20,45,25,0.9))'
                        FooterBorder='rgba(120,200,140,0.25)'
                        ItemColor='#c5f2d0'
                        ItmeMouseOverBackground='rgba(70,130,90,0.25)'
                        ItmeMouseOverBorder='rgba(120,200,140,0.45)'
                    />
                </div>
            </div>

            <style jsx>{`
        @keyframes petalfall {
          0% { 
            transform: translateY(-20px) rotate(0deg) translateX(0px); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.9; 
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(30px);
            opacity: 0.8;
          }
          90% { 
            opacity: 0.4; 
          }
          100% { 
            transform: translateY(100vh) rotate(360deg) translateX(-15px); 
            opacity: 0; 
          }
        }

        @keyframes butterflyFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-10px) translateX(5px) rotate(2deg); 
          }
          50% { 
            transform: translateY(-5px) translateX(-8px) rotate(-1deg); 
          }
          75% { 
            transform: translateY(-12px) translateX(3px) rotate(1deg); 
          }
        }

        @keyframes float {
            0% { transform: translateY(-20px) rotate(5deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(${windowSize.height + 20}px) rotate(15deg); opacity: 0; }
          }

          /* Custom scrollbar styling */
          .dashboard-container::-webkit-scrollbar,
          .dashboard-container *::-webkit-scrollbar {
            width: ${isMobile ? '4px' : '6px'};
            height: ${isMobile ? '4px' : '6px'};
          }

          .dashboard-container::-webkit-scrollbar-track,
          .dashboard-container *::-webkit-scrollbar-track {
          background: rgba(34, 139, 34, 0.2);
          border-radius: 4px;
          }

          .dashboard-container::-webkit-scrollbar-thumb,
          .dashboard-container *::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(144, 238, 144, 0.6), rgba(50, 205, 50, 0.8));
          border-radius: 4px;
          border: 1px solid rgba(34, 139, 34, 0.3);
          }

          .dashboard-container::-webkit-scrollbar-thumb:hover,
          .dashboard-container *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(144, 238, 144, 0.8), rgba(50, 205, 50, 1));
          }

          /* Ensure smooth scrolling */
          .dashboard-container {
            scroll-behavior: smooth;
          }

          /* Mobile-specific optimizations */
          @media (max-width: 767px) {
            .dashboard-container {
              -webkit-overflow-scrolling: touch;
              scroll-padding-top: 20px;
            }
          }

          /* Touch-friendly interactive elements on mobile */
          @media (max-width: 767px) {
            button, .interactive, [role="button"] {
              min-height: 44px;
              min-width: 44px;
            }
          }
      `}</style>
        </div>
    );
};

export default TreeDashboard;