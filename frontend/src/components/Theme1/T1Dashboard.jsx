// src/components/T4Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import VideosPanel from './VideosPanel.jsx'
import TrailVirtualImpact from '../TrialComps/TrialVirtualImpact.jsx';
import TrialCurrentRank from '../TrialComps/TrialCurrentRank.jsx';
import TrialImpactStats from '../TrialComps/TrialImpactStats.jsx';
import TrialLeaderBoard from '../TrialComps/TrialLeaderBoard.jsx';
import TrialLockedThemes from '../TrialComps/TrialLockedThemes.jsx';
import TrialHeader from '../TrialComps/TrialHeader.jsx';
import TrialFooter from '../TrialComps/TrialFooter.jsx';

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

const GarbageDashboard = ({ onClose, onPlayVideo }) => {
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

  // Floating particles
  useEffect(() => {
    const createParticle = () => {
      const id = Math.random();
      const size = Math.random() * (isMobile ? 3 : 4) + 2;
      const startPosition = Math.random() * windowSize.width;
      const animationDuration = Math.random() * 1.5 + 3;

      const newParticle = { id, size, left: startPosition, duration: animationDuration };
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
      background: 'radial-gradient(1200px 600px at 50% 30%, rgba(10,14,10,0.96), #070a07)',
      color: '#b9f0b8ff',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* Background video */}
      <video
        ref={videoRef}
        src="/assets/Theme_1.mp4"
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
        src="/assets/theme-1.mp3"
        autoPlay
        loop
        muted={isMuted}
        style={{ display: 'none' }}
      />

      {/* Vignette and film grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27128%27 height=%27128%27 viewBox=%270 0 128 128%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%272%27 stitchTiles=%27stitch%27/></filter><rect width=%27128%27 height=%27128%27 filter=%27url(%23n)%27 opacity=%270.04%27/></svg>")',
          opacity: 0.5,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Background color splotches */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 50%, rgba(40, 80, 50, 0.30) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(30, 60, 40, 0.22) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(50, 90, 60, 0.22) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            background: 'rgba(110, 160, 90, 0.26)',
            borderRadius: '50%',
            pointerEvents: 'none',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}px`,
            animation: `float ${particle.duration}s linear`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Main dashboard - Responsive Grid */}
      <div
        className="dashboard-container"
        style={{
          height: '100vh',
          width: '100vw',
          padding: isMobile ? '8px' : isTablet ? '12px' : '16px',
          background: 'rgba(0, 10, 0, 0.28)',
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
            themeno={2}
            isMuted={isMuted}
            onUnmute={() => setIsMuted(false)}
            onClose={onClose}
            playHover={playHover}
            playAction={playAction}
            HeaderBackGround='rgba(0, 15, 0, 0.5)'
            HeaderBorder='rgba(60, 110, 70, 0.45)'
            ButtonBackground='rgba(60, 110, 70, 0.55)'
            ButtonBorder='rgba(60, 110, 70, 0.6)'
            ButtonColor='#b9d6b6'
            ButtonMouseOverBoxshadow='0 8px 20px rgba(0,0,0,0.35), 0 0 0 2px rgba(150, 200, 160, 0.2) inset'
            HeadingColor='#b9d6b6'
            SubHeadingColor='#7ea17e'
          />
        </div>

        {/* Left Column Components */}
        {isMobile ? (
          <>
            <div style={{ gridArea: 'left-top' }}>
              <TrialCurrentRank
                themeno={1}
                NameColor="wheat"
                LevelColor="#b9d6b6"
                RoleColor="#a7b5a8"
                ProgresBarBackground='rgba(0, 0, 0, 0.5)'
                ProgresBarBorder='rgba(60, 110, 70, 0.3)'
                ProgresBarInnerBackground='linear-gradient(90deg, #356a3f, #5e9f6c, #86c28e)'
                XPColor='#a7b5a8'
                StreakBackground='rgba(50, 90, 60, 0.25)'
                StreakBoxShadow='rgba(60,110,70,0.25)'
                StreakBorder='rgba(60, 110, 70, 0.35)'
                StreakColor='#ffd966'
              />
            </div>
            <div style={{ gridArea: 'left-bottom' }}>
              <TrailVirtualImpact
                playHover={playHover}
                playAction={playAction}
                themeno={1}
                RowBottomBorderColor='rgba(60, 110, 70, 0.22)'
                MouseOverBackground='rgba(60, 110, 70, 0.12)'
                MouseOverBoxshadowColor='rgba(150,180,160,0.15)'
                impactcolor='#b9d6b6'
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
                themeno={1}
                NameColor="wheat"
                LevelColor="#b9d6b6"
                RoleColor="#a7b5a8"
                ProgresBarBackground='rgba(0, 0, 0, 0.5)'
                ProgresBarBorder='rgba(60, 110, 70, 0.3)'
                ProgresBarInnerBackground='linear-gradient(90deg, #356a3f, #5e9f6c, #86c28e)'
                XPColor='#a7b5a8'
                StreakBackground='rgba(50, 90, 60, 0.25)'
                StreakBoxShadow='rgba(60,110,70,0.25)'
                StreakBorder='rgba(60, 110, 70, 0.35)'
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
                  themeno = {1}
                  RowBottomBorderColor='rgba(60, 110, 70, 0.22)'
                  MouseOverBackground='rgba(60, 110, 70, 0.12)'
                  MouseOverBoxshadowColor='rgba(150,180,160,0.15)'
                  impactcolor='#b9d6b6'
                  
                />
            </div>
          </div>
        )}

        {/* Middle Column Components */}
        {isMobile ? (
          <>
            <div style={{ gridArea: 'middle-top', minHeight: '300px' }}>
              <VideosPanel
                onVideoSelect={onPlayVideo}
                playHover={playHover}
                playAction={playAction}
              />
            </div>
            <div style={{ gridArea: 'middle-bottom', minHeight: '200px' }}>
              <TrialLockedThemes
                themeno={1}
                ButtonBackground='rgba(20,40,25,0.8)'
                ButtonBorder='rgba(60,110,70,0.5)'
                ButtonColor='#b9d6b6'
                ButtonMouseOverBackground='rgba(60,110,70,0.9)'
                ButtonMouseOverBorder='rgba(120,180,130,0.7)'
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
              <VideosPanel
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
                  themeno={1}
                  ButtonBackground='rgba(20,40,25,0.8)'
                  ButtonBorder='rgba(60,110,70,0.5)'
                  ButtonColor='#b9d6b6'
                  ButtonMouseOverBackground='rgba(60,110,70,0.9)'
                  ButtonMouseOverBorder='rgba(120,180,130,0.7)'
                />
            </div>
          </div>
        )}

        {/* Right Column Components */}
        {isMobile ? (
          <>
            <div style={{ gridArea: 'right-top', minHeight: '250px' }}>
              <TrialLeaderBoard
                themeno={1}
                LevelBorder='rgba(60, 110, 70, 0.4)'
                LevelBackground='rgba(20, 40, 25, 0.85)'
                LevelColor='#b9d6b6'
                OptionBackground='#203020'
                OptionColor='#b9d6b6'
                RowMouseOverBackground='rgba(60, 110, 70, 0.12)'
                RowMouseOverBorderLeft='rgba(120,180,130,0.6)'
                RowRankNumberColor='#b9d6b6'
                RowStudentNameColor='#b9d6b6'
                RowStudentPointsColor='#7db07f'
              />
            </div>
            <div style={{ gridArea: 'right-bottom', minHeight: '200px' }}>
              <TrialImpactStats
                themeno={1}
                RowBackground='rgba(0, 0, 0, 0.28)'
                RowBorder='rgba(60, 110, 70, 0.3)'
                RowMouseOverBorderColor='rgba(140,180,150,0.35)'
                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                ItemNameColor='#a7b5a8'
                ItemValueColor='#a7b5a8'
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
              overflow: 'auto'
            }}>
                <TrialLeaderBoard
                  themeno={1}
                  LevelBorder='rgba(60, 110, 70, 0.4)'
                  LevelBackground='rgba(20, 40, 25, 0.85)'
                  LevelColor='#b9d6b6'
                  OptionBackground='#203020'
                  OptionColor='#b9d6b6'
                  RowMouseOverBackground='rgba(60, 110, 70, 0.12)'
                  RowMouseOverBorderLeft='rgba(120,180,130,0.6)'
                  RowRankNumberColor='#b9d6b6'
                  RowStudentNameColor='#b9d6b6'
                  RowStudentPointsColor='#7db07f'
                />
            </div>
            <div style={{
              flex: '1',
              minHeight: isTablet ? 'auto' : '200px',
              overflow: 'auto'
            }}>
                <TrialImpactStats
                  themeno={1}
                  RowBackground='rgba(0, 0, 0, 0.28)'
                  RowBorder='rgba(60, 110, 70, 0.3)'
                  RowMouseOverBorderColor='rgba(140,180,150,0.35)'
                  RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                  ItemNameColor='#a7b5a8'
                  ItemValueColor='#a7b5a8'
                />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ gridArea: 'footer' }}>
          <TrialFooter
            playHover={playHover}
            playAction={playAction}
            FooterBackground='rgba(0, 10, 0, 0.4)'
            FooterBorder='rgba(50, 90, 60, 0.45)'
            ItemColor='#a7b5a8'
            ItmeMouseOverBackground='rgba(60, 110, 70, 0.15)'
            ItmeMouseOverBorder='rgba(120,180,130,0.3)'
          />
        </div>
      </div>

      <style jsx>{`
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
          background: rgba(0, 0, 0, 1);
          border-radius: 3px;
        }

        .dashboard-container::-webkit-scrollbar-thumb,
        .dashboard-container *::-webkit-scrollbar-thumb {
          background: rgba(45, 105, 0, 0.58);
          border-radius: 3px;
        }

        .dashboard-container::-webkit-scrollbar-thumb:hover,
        .dashboard-container *::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 98, 8, 0.5);
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

export default GarbageDashboard;