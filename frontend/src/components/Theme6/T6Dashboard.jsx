// src/components/T5Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TrailVirtualImpact from '../TrialComps/TrialVirtualImpact.jsx';
import TrialCurrentRank from '../TrialComps/TrialCurrentRank.jsx';
import TrialImpactStats from '../TrialComps/TrialImpactStats.jsx';
import TrialLeaderBoard from '../TrialComps/TrialLeaderBoard.jsx';
import TrialLockedThemes from '../TrialComps/TrialLockedThemes.jsx';
import TrialHeader from '../TrialComps/TrialHeader.jsx';
import TrialFooter from '../TrialComps/TrialFooter.jsx';
import BloosomPanel from './BloosomPanel.jsx';

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

const BloosomDashboard = ({ onClose, onPlayVideo }) => {
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
      background: 'radial-gradient(1200px 600px at 50% 30%, rgba(139, 69, 101, 0.95), rgba(72, 39, 57, 0.98))', 
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
            ? 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FF1493 100%)'
            : p.petalType === 1
            ? 'linear-gradient(135deg, #FFCCCB 0%, #FFC0CB 50%, #FF69B4 100%)'
            : p.petalType === 2
            ? 'linear-gradient(135deg, #F8BBD9 0%, #E91E63 50%, #C2185B 100%)'
            : 'linear-gradient(135deg, #FFE4E1 0%, #FF91A4 50%, #FF1493 100%)',
          borderRadius: p.petalType === 0 
            ? '50% 0 50% 0'
            : p.petalType === 1
            ? '0 50% 50% 50%'
            : p.petalType === 2
            ? '50% 50% 0 50%'
            : '80% 20% 80% 20%',
          animation: `petalfall ${p.duration}s ease-in-out`, 
          zIndex: 1, 
          boxShadow: '0 2px 8px rgba(255, 182, 193, 0.4)',
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
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6)) hue-rotate(300deg) saturate(1.3)'
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
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6)) hue-rotate(300deg) saturate(1.3)'
          }}
        />
      </div>

      {/* Butterfly GIF positioned near top of plant */}
<div style={{
  position: 'absolute',
  top: 'clamp(150px, 25vw, 180px)', // Positioned relative to plant height
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
      filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6)) hue-rotate(300deg) saturate(1.3)'
    }}
  />
</div>
      {/* Cherry Blossom Tree GIF in bottom right corner */}
      <div style={{
        position: 'absolute',
        top: '17px',
        right: '17px',
        zIndex: 10,
        
      }}>
        <img 
          src="/assets/Cute.gif" 
          alt="Cherry Blossoms" 
          style={{
            width: 'clamp(160px, 30vw, 300px)',
            height: 'auto',
            filter: 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.5)) hue-rotate(320deg) saturate(1.4) brightness(1.1)',
            borderRadius: '0 12px 0 0'
          }}
        />
      </div>

      {/* Background video with cherry blossom filter */}
      <video 
        ref={videoRef} 
        src="/assets/cherry.mp4" 
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

      {/* Cherry blossom overlay with pink tints */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(180deg, rgba(219, 112, 147, 0.15) 0%, rgba(199, 21, 133, 0.2) 50%, rgba(139, 69, 101, 0.25) 100%)', 
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
            HeaderBackGround='linear-gradient(160deg, rgba(139,69,101,0.85), rgba(72,39,57,0.95))'
            HeaderBorder='rgba(255,182,193,0.35)'
            ButtonBackground='rgba(90,40,70,0.6)'
            ButtonBorder='rgba(255,182,193,0.35)'
            ButtonColor='#fce4ec'
            ButtonMouseOverBoxshadow='rgba(200,120,150,0.85)'
            Heading='BLOSSOM GUARDIAN'
            SubHeading='Petal Growth & Harmony Tracker'
            HeadingColor='#fce4ec'
            SubHeadingColor='#f8bbd0'
          />
        </div>

        {/* Left Column Components */}
        {isMobile ? (
          <>
            <div style={{ gridArea: 'left-top' }}>
              <TrialCurrentRank
                themeno={6}
                NameColor="#ffe4f1"
                LevelColor="#ffb6c1"
                RoleColor="#f8bbd0"
                ProgresBarBackground='rgba(60, 20, 50, 0.6)'
                ProgresBarBorder='rgba(255,182,193,0.4)'
                ProgresBarInnerBackground='linear-gradient(90deg, #ff80ab, #f48fb1, #fce4ec)'
                XPColor='#f8bbd0'
                StreakBackground='rgba(255,105,180,0.3)'
                StreakBoxShadow='rgba(60,110,70,0.25)'
                StreakBorder='rgba(255, 182, 193, 0.4)'
                StreakColor='#ffd966'
              />
            </div>
            <div style={{ gridArea: 'left-bottom' }}>
              <TrailVirtualImpact
                playHover={playHover}
                playAction={playAction}
                themeno={6}
                RowBottomBorderColor='rgba(255,182,193,0.2)'
                MouseOverBackground='rgba(255,182,193,0.15)'
                MouseOverBoxshadowColor='rgba(255,105,180,0.35)'
                impactcolor='#f8bbd0'
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
                themeno={6}
                NameColor="#ffe4f1"
                LevelColor="#ffb6c1"
                RoleColor="#f8bbd0"
                ProgresBarBackground='rgba(60, 20, 50, 0.6)'
                ProgresBarBorder='rgba(255,182,193,0.4)'
                  ProgresBarInnerBackground='linear-gradient(90deg, #ff80ab, #f48fb1, #fce4ec)'
                  XPColor='#f8bbd0'
                  StreakBackground='rgba(255,105,180,0.3)'
                StreakBoxShadow='rgba(60,110,70,0.25)'
                  StreakBorder='rgba(255, 182, 193, 0.4)'
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
                themeno={6}
                  RowBottomBorderColor='rgba(255,182,193,0.2)'
                  MouseOverBackground='rgba(255,182,193,0.15)'
                  MouseOverBoxshadowColor='rgba(255,105,180,0.35)'
                  impactcolor='#f8bbd0'
              />
            </div>
          </div>
        )}

        {/* Middle Column Components */}
        {isMobile ? (
          <>
            <div style={{ gridArea: 'middle-top', minHeight: '300px' }}>
              <BloosomPanel
                onVideoSelect={onPlayVideo}
                playHover={playHover}
                playAction={playAction}
              />
            </div>
            <div style={{ gridArea: 'middle-bottom', minHeight: '200px' }}>
              <TrialLockedThemes
                themeno={6}
                ButtonBackground='rgba(60,20,60,0.9)'
                ButtonBorder='rgba(255,150,210,0.5)'
                ButtonColor='#ffc1e3'
                ButtonMouseOverBackground='rgba(255,150,210,0.85)'
                ButtonMouseOverBorder='rgba(180, 120, 172, 0.7)'
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
              <BloosomPanel
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
                themeno={6}
                  ButtonBackground='rgba(60,20,60,0.9)'
                  ButtonBorder='rgba(255,150,210,0.5)'
                  ButtonColor='#ffc1e3'
                  ButtonMouseOverBackground='rgba(255,150,210,0.85)'
                ButtonMouseOverBorder='rgba(180, 120, 172, 0.7)'
              />
            </div>
          </div>
        )}

        {/* Right Column Components */}
        {isMobile ? (
          <>
            <div style={{ gridArea: 'right-top', minHeight: '250px' }}>
              <TrialLeaderBoard
                themeno={6}
                LevelBorder='rgba(255,182,193,0.25)'
                LevelBackground='rgba(255,192,203,0.08)'
                LevelColor='#b9d6b6'
                OptionBackground='#203020'
                OptionColor='#b9d6b6'
                RowMouseOverBackground='rgba(255,182,193,0.15)'
                RowMouseOverBorderLeft='rgba(255,182,193,0.5)'
                RowRankNumberColor='#b9d6b6'
                RowStudentNameColor='#f8bbd0'
                RowStudentPointsColor='#ff80ab'
              />
            </div>
            <div style={{ gridArea: 'right-bottom', minHeight: '200px' }}>
              <TrialImpactStats
                themeno={6}
                RowBackground='rgba(255,192,203,0.08)'
                RowBorder='rgba(255,182,193,0.25)'
                RowMouseOverBorderColor='rgba(255,182,193,0.5)'
                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                ItemNameColor='#f8bbd0'
                ItemValueColor='#ff80ab'
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
              
                themeno={6}
                  LevelBorder='rgba(255,182,193,0.25)'
                  LevelBackground='rgba(255,192,203,0.08)'
                LevelColor='#b9d6b6'
                OptionBackground='#203020'
                OptionColor='#b9d6b6'
                  RowMouseOverBackground='rgba(255,182,193,0.15)'
                  RowMouseOverBorderLeft='rgba(255,182,193,0.5)'
                RowRankNumberColor='#b9d6b6'
                  RowStudentNameColor='#f8bbd0'
                  RowStudentPointsColor='#ff80ab'
              />
            </div>
            <div style={{
              flex: '1',
              minHeight: isTablet ? 'auto' : '200px',
              overflow: 'auto'
            }}>
              <TrialImpactStats
                themeno={6}
                  RowBackground='rgba(255,192,203,0.08)'
                  RowBorder='rgba(255,182,193,0.25)'
                  RowMouseOverBorderColor='rgba(255,182,193,0.5)'
                RowMouseOverBoxShadow='rgba(0,0,0,0.35)'
                  ItemNameColor='#f8bbd0'
                  ItemValueColor='#ff80ab'
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ gridArea: 'footer' }}>
          <TrialFooter
            playHover={playHover}
            playAction={playAction}
            FooterBackground='linear-gradient(160deg,rgba(72,39,57,0.95), rgba(139,69,101,0.85) )'
            FooterBorder='rgba(255,182,193,0.35)'
            ItemColor='#fce4ec'
            ItmeMouseOverBackground='rgba(255,182,193,0.15)'
            ItmeMouseOverBorder='rgba(255,182,193,0.45)'
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
          background: rgba(139, 69, 101, 0.2);
          border-radius: 4px;
          }

          .dashboard-container::-webkit-scrollbar-thumb,
          .dashboard-container *::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(255, 182, 193, 0.6), rgba(255, 105, 180, 0.8));
          border-radius: 4px;
          border: 1px solid rgba(139, 69, 101, 0.3);
          }

          .dashboard-container::-webkit-scrollbar-thumb:hover,
          .dashboard-container *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 1));
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

export default BloosomDashboard;