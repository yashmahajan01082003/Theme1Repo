// src/components/T5Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TrailVirtualImpact from '../TrialComps/TrialVirtualImpact.jsx';
import TrialCurrentRank from '../TrialComps/TrialCurrentRank.jsx';
import TrialImpactStats from '../TrialComps/TrialImpactStats.jsx';
import TrialLeaderBoard from '../TrialComps/TrialLeaderBoard.jsx';
import TrialLockedThemes from '../TrialComps/TrialLockedThemes.jsx';
import TrialHeader from '../TrialComps/TrialHeader.jsx';
import TrialFooter from '../TrialComps/TrialFooter.jsx';
import RainyPanel from './RainyPanel.jsx';

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

const RainyDashboard = ({ onClose, onPlayVideo }) => {
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
            const size = Math.random() * 8 + 6;
            const startPosition = Math.random() * window.width;
            const animationDuration = Math.random() * 3 + 5;
            const petalType = Math.floor(Math.random() * 4); // Different petal shapes

            const newParticle = {
                id,
                size,
                left: startPosition,
                duration: animationDuration,
                petalType,
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
                rows: 'auto auto auto auto auto 280px auto',
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
            background: 'radial-gradient(1200px 600px at 50% 30%, rgba(15,25,45,0.96), #0a1520)',
            color: '#b8d4f0',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            position: 'relative' 
        }}>

            {isMobile?
            (
                <></>
            ):(
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        zIndex: 10,
                    }}>
                        <img
                            src="/assets/PuppyInRain.gif"
                            alt="Butterfly"
                            style={{
                                width: '120px',
                                height: '120px',
                                filter: 'drop-shadow(0 0 10px rgba(0, 68, 255, 0.6)) hue-rotate(100deg) saturate(1) brightness(0.8)'
                            }}
                        />
                    </div>
            )}

            {isMobile?(
                <></>
            ):(
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '-22px',
                        zIndex: 5,

                    }}>
                        <img
                            src="/assets/RainyCloud.gif"
                            alt="Cherry Blossoms"
                            style={{
                                width: 'clamp(160px, 30vw, 300px)',
                                height: 'auto',
                                filter: 'drop-shadow(0 0 15px rgba(105, 115, 255, 0.5)) hue-rotate(350deg) saturate(1.5) brightness(0.7)',
                                borderRadius: '0 12px 0 0',
                                zIndex: '4'
                            }}
                        />
                    </div>
            )}

            {/* Cherry Blossom Tree GIF in bottom right corner */}


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
                    filter: 'brightness(0.4) saturate(0.8) hue-rotate(200deg) contrast(1.1)'
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

            {/* Cherry blossom overlay with pink tints */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(112, 137, 219, 0.15) 0%, rgba(21, 89, 199, 0.2) 50%, rgba(69, 75, 139, 0.25) 100%)',
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
                    background: 'rgba(10, 25, 50, 0.35)',
                    border: '1px solid rgba(70, 130, 180, 0.4)', 
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
                        themeno={4}
                        isMuted={isMuted}
                        onUnmute={() => setIsMuted(false)}
                        onClose={onClose}
                        playHover={playHover}
                        playAction={playAction}
                        HeaderBackGround='linear-gradient(160deg, rgba(5,10,20,0.95), rgba(15,25,35,0.9))'
                        HeaderBorder='rgba(120,160,200,0.25)'
                        ButtonBackground='rgba(35,55,75,0.6)'
                        ButtonBorder='rgba(110,193,228,0.35)'
                        ButtonColor='#cfe7f5'
                        ButtonMouseOverBoxshadow='rgba(60,100,140,0.8)'
                        Heading='BLOSSOM GUARDIAN'
                        SubHeading='Petal Growth & Harmony Tracker'
                        HeadingColor='#b8d4f0'
                        SubHeadingColor='#87ceeb'
                    />
                </div>

                {/* Left Column Components */}
                {isMobile ? (
                    <>
                        <div style={{ gridArea: 'left-top' }}>
                            <TrialCurrentRank
                                themeno={4}
                                NameColor="#e6f3ff"
                                LevelColor="#b8d4f0"
                                RoleColor="#87ceeb"
                                ProgresBarBackground='rgba(0, 20, 40, 0.6)'
                                ProgresBarBorder='rgba(70, 130, 180, 0.4)'
                                ProgresBarInnerBackground='linear-gradient(90deg, #4682b4, #6bb6ff, #87ceeb)'
                                XPColor='#87ceeb'
                                StreakBackground='rgba(70, 130, 180, 0.25)'
                                StreakBoxShadow='rgba(70,130,180,0.25)'
                                StreakBorder='rgba(70, 130, 180, 0.4)'
                                StreakColor='#ffd966'
                            />
                        </div>
                        <div style={{ gridArea: 'left-bottom' }}>
                            <TrailVirtualImpact
                                playHover={playHover}
                                playAction={playAction}
                                themeno={4}
                                RowBottomBorderColor='rgba(120,160,200,0.15)'
                                MouseOverBackground='rgba(35,55,75,0.45)'
                                MouseOverBoxshadowColor='rgba(110,193,228,0.35)'
                                impactcolor='#cfe7f5'
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
                                    themeno={4}
                                    NameColor="#e6f3ff"
                                    LevelColor="#b8d4f0"
                                    RoleColor="#87ceeb"
                                    ProgresBarBackground='rgba(0, 20, 40, 0.6)'
                                    ProgresBarBorder='rgba(70, 130, 180, 0.4)'
                                    ProgresBarInnerBackground='linear-gradient(90deg, #4682b4, #6bb6ff, #87ceeb)'
                                    XPColor='#87ceeb'
                                    StreakBackground='rgba(70, 130, 180, 0.25)'
                                    StreakBoxShadow='rgba(70,130,180,0.25)'
                                    StreakBorder='rgba(70, 130, 180, 0.4)'
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
                                themeno={4}
                                    RowBottomBorderColor='rgba(120,160,200,0.15)'
                                    MouseOverBackground='rgba(35,55,75,0.45)'
                                    MouseOverBoxshadowColor='rgba(110,193,228,0.35)'
                                    impactcolor='#cfe7f5'
                            />
                        </div>
                    </div>
                )}

                {/* Middle Column Components */}
                {isMobile ? (
                    <>
                        <div style={{ gridArea: 'middle-top', minHeight: '300px' }}>
                            <RainyPanel
                                onVideoSelect={onPlayVideo}
                                playHover={playHover}
                                playAction={playAction}
                            />
                        </div>
                        <div style={{ gridArea: 'middle-bottom', minHeight: '200px' }}>
                            <TrialLockedThemes
                                themeno={4}
                                ButtonBackground='rgba(20,30,50,0.8)'
                                ButtonBorder='rgba(100,150,200,0.5)'
                                ButtonColor='#a8c7e2'
                                ButtonMouseOverBackground='rgba(70,120,160,0.9)'
                                ButtonMouseOverBorder='rgba(140,190,240,0.7)'
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
                            <RainyPanel
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
                                themeno={4}
                                    ButtonBackground='rgba(20,30,50,0.8)'
                                    ButtonBorder='rgba(100,150,200,0.5)'
                                    ButtonColor='#a8c7e2'
                                    ButtonMouseOverBackground='rgba(70,120,160,0.9)'
                                    ButtonMouseOverBorder='rgba(140,190,240,0.7)'
                            />
                        </div>
                    </div>
                )}

                {/* Right Column Components */}
                {isMobile ? (
                    <>
                        <div style={{ gridArea: 'right-top', minHeight: '250px' }}>
                            <TrialLeaderBoard
                                themeno={4}
                                LevelBorder='rgba(120,160,200,0.25)'
                                LevelBackground='rgba(20,30,40,0.85)'
                                LevelColor='#a6c3e6'
                                OptionBackground='#0a141f'
                                OptionColor='#a6c3e6'
                                RowMouseOverBackground='rgba(255,182,193,0.15)'
                                RowMouseOverBorderLeft='rgba(255,182,193,0.5)'
                                RowRankNumberColor='#b9d6b6'
                                RowStudentNameColor='#a6c3e6'
                                RowStudentPointsColor='#6ec1e4'
                            />
                        </div>
                        <div style={{ gridArea: 'right-bottom', minHeight: '200px' }}>
                            <TrialImpactStats
                                themeno={4}
                                RowBackground='rgba(25,40,55,0.35)'
                                RowBorder='rgba(100,150,200,0.25)'
                                RowMouseOverBorderColor='rgba(110,193,228,0.4)'
                                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                                ItemNameColor='#cfe7f5'
                                ItemValueColor='#6ec1e4'
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
                                    themeno={4}
                                    LevelBorder='rgba(120,160,200,0.25)'
                                    LevelBackground='rgba(20,30,40,0.85)'
                                    LevelColor='#a6c3e6'
                                    OptionBackground='#0a141f'
                                    OptionColor='#a6c3e6'
                                    RowMouseOverBackground='rgba(25,35,50,0.35)'
                                    RowMouseOverBorderLeft='rgba(110,193,228,0.4)'
                                    RowRankNumberColor='#b9d6b6'
                                    RowStudentNameColor='#a6c3e6'
                                    RowStudentPointsColor='#6ec1e4'
                            />
                        </div>
                        <div style={{
                            flex: '1',
                            minHeight: isTablet ? 'auto' : '200px',
                            overflow: 'auto'
                        }}>
                            <TrialImpactStats
                                themeno={4}
                                    RowBackground='rgba(25,40,55,0.35)'
                                    RowBorder='rgba(100,150,200,0.25)'
                                    RowMouseOverBorderColor='rgba(110,193,228,0.4)'
                                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                                    ItemNameColor='#cfe7f5'
                                    ItemValueColor='#6ec1e4'
                            />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ gridArea: 'footer' }}>
                    <TrialFooter
                        playHover={playHover}
                        playAction={playAction}
                        FooterBackground='linear-gradient(160deg, rgba(5,10,20,0.95), rgba(15,25,35,0.9))'
                        FooterBorder='rgba(120,160,200,0.25)'
                        ItemColor='#b8d4f0'
                        ItmeMouseOverBackground='rgba(90,140,190,0.25)'
                        ItmeMouseOverBorder='rgba(135,206,235,0.45)'
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
          background: rgba(70, 130, 180, 0.1);
          border-radius: 4px;
          }

          .dashboard-container::-webkit-scrollbar-thumb,
          .dashboard-container *::-webkit-scrollbar-thumb {
          background: rgba(135, 206, 235, 0.3);
          border-radius: 4px;
          border: 1px solid rgba(69, 74, 139, 0.3);
          }

          .dashboard-container::-webkit-scrollbar-thumb:hover,
          .dashboard-container *::-webkit-scrollbar-thumb:hover {
          background: rgba(135, 206, 235, 0.5);
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

export default RainyDashboard;