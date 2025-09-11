import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BloosomPanel = ({ onVideoSelect }) => {
  const [petals, setPetals] = useState([]);
  const [bloomActive, setBloomActive] = useState(false);
  const [branches, setBranches] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const petalParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      opacity: 0.7 + Math.random() * 0.3,
      type: Math.floor(Math.random() * 3), // Different petal types
    }));
    setPetals(petalParticles);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Cherry blossom bloom effect
  useEffect(() => {
    const bloomInterval = setInterval(() => {
      setBloomActive(true);
      setTimeout(() => setBloomActive(false), 600);
    }, 15000 + Math.random() * 10000);

    return () => clearInterval(bloomInterval);
  }, []);

  // Create branch growth effect on hover
  useEffect(() => {
    if (isHovered) {
      const branchGrowth = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        startX: 10 + Math.random() * 80,
        startY: 80 + Math.random() * 15,
        growthDelay: i * 200,
        direction: Math.random() > 0.5 ? 1 : -1,
        angle: -30 + Math.random() * 60,
      }));
      setBranches(branchGrowth);

      // Clear branches after animation
      const clearTimer = setTimeout(() => {
        setBranches([]);
      }, 4000);

      return () => clearTimeout(clearTimer);
    } else {
      setBranches([]);
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

  const missions = [
    { id: 1, title: "Sakura Festival", progress: 92, type: "cultural" },
    { id: 2, title: "Garden Restoration", progress: 75, type: "community" },
    { id: 3, title: "Blossom Photography", progress: 58, type: "artistic" },
    { id: 4, title: "Tea Ceremony Setup", progress: 35, type: "traditional" },
    { id: 5, title: "Hanami Preparation", progress: 18, type: "seasonal" }
  ];

  return (
    <div
      style={{
        ...panelBase,
        background: `linear-gradient(135deg, 
          rgba(255, 182, 193, 0.9), 
          rgba(255, 192, 203, 0.85),
          rgba(255, 228, 225, 0.8),
          rgba(255, 218, 185, 0.85)
        )`,
        border: `2px solid rgba(255, 182, 193, 0.6)`,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'hidden',
        backdropFilter: 'blur(12px)',
        width: '100%',
        height: '100%',
        minHeight: 'clamp(300px, 35vh, 450px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: bloomActive 
          ? '0 0 50px rgba(255, 182, 193, 0.9), inset 0 0 30px rgba(255, 105, 180, 0.4)' 
          : '0 15px 40px rgba(0,0,0,0.3), inset 0 0 25px rgba(255, 182, 193, 0.2)',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.borderColor = 'rgba(255, 182, 193, 0.8)';
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(255, 105, 180, 0.4), inset 0 0 35px rgba(255, 182, 193, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'rgba(255, 182, 193, 0.6)';
        e.currentTarget.style.boxShadow = bloomActive 
          ? '0 0 50px rgba(255, 182, 193, 0.9), inset 0 0 30px rgba(255, 105, 180, 0.4)' 
          : '0 15px 40px rgba(0,0,0,0.3), inset 0 0 25px rgba(255, 182, 193, 0.2)';
      }}
    >
      {/* Cherry Blossom GIF Overlay - Top Right Corner covering entire card */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="petal" cx="50%" cy="50%"><stop offset="0%" stop-color="%23FFB6C1" stop-opacity="0.8"/><stop offset="100%" stop-color="%23FFC0CB" stop-opacity="0.3"/></radialGradient></defs><g class="petals"><circle cx="85" cy="15" r="3" fill="url(%23petal)" opacity="0.9"><animate attributeName="cy" values="15;25;15" dur="3s" repeatCount="indefinite"/></circle><circle cx="90" cy="20" r="2.5" fill="url(%23petal)" opacity="0.7"><animate attributeName="cy" values="20;30;20" dur="4s" repeatCount="indefinite"/></circle><circle cx="80" cy="25" r="2" fill="url(%23petal)" opacity="0.8"><animate attributeName="cy" values="25;35;25" dur="3.5s" repeatCount="indefinite"/></circle></g></svg>')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.6,
          borderRadius: '12px',
        }}
      />

      {/* Bloom flash overlay */}
      {bloomActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 182, 193, 0.4)',
            borderRadius: '12px',
            pointerEvents: 'none',
            animation: 'cherryBloom 0.6s ease-out',
            zIndex: 2,
          }}
        />
      )}

      {/* Floating petals animation */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          style={{
            position: 'absolute',
            left: `${petal.left}%`,
            top: '-15px',
            width: 'clamp(8px, 2vw, 12px)',
            height: 'clamp(10px, 2.5vw, 14px)',
            background: petal.type === 0 
              ? 'radial-gradient(circle, rgba(255, 182, 193, 0.9), rgba(255, 105, 180, 0.7))' 
              : petal.type === 1 
              ? 'radial-gradient(circle, rgba(255, 192, 203, 0.9), rgba(255, 20, 147, 0.7))' 
              : 'radial-gradient(circle, rgba(255, 228, 225, 0.9), rgba(255, 182, 193, 0.8))',
            borderRadius: petal.type === 0 
              ? '50% 20% 50% 80%' 
              : petal.type === 1 
              ? '80% 50% 20% 50%' 
              : '50% 80% 50% 20%',
            animation: `petalFloat ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
            pointerEvents: 'none',
            zIndex: 3,
            filter: 'drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3))',
            transform: 'rotate(0deg)',
          }}
        />
      ))}

      {/* Growing cherry branches on hover */}
      {branches.map((branch) => (
        <div
          key={branch.id}
          style={{
            position: 'absolute',
            left: `${branch.startX}%`,
            bottom: `${branch.startY}%`,
            width: 'clamp(4px, 1vw, 6px)',
            height: '0',
            background: 'linear-gradient(to top, rgba(139, 69, 19, 0.8), rgba(160, 82, 45, 0.6))',
            borderRadius: '3px 3px 0 0',
            animation: `branchGrow 3s ease-out ${branch.growthDelay}ms forwards`,
            transformOrigin: 'bottom',
            pointerEvents: 'none',
            zIndex: 4,
            transform: `rotate(${branch.angle}deg)`,
          }}
        >
          {/* Cherry blossoms on branches */}
          <div style={{
            position: 'absolute',
            top: '40%',
            left: branch.direction > 0 ? '-6px' : '2px',
            width: 'clamp(6px, 1.5vw, 8px)',
            height: 'clamp(6px, 1.5vw, 8px)',
            background: 'radial-gradient(circle, #FFB6C1, #FF69B4)',
            borderRadius: '50% 20% 50% 80%',
            animation: `blossomBloom 1.5s ease-out ${branch.growthDelay + 1000}ms both`,
          }} />
          <div style={{
            position: 'absolute',
            top: '70%',
            right: branch.direction > 0 ? '2px' : '-6px',
            width: 'clamp(5px, 1.2vw, 7px)',
            height: 'clamp(5px, 1.2vw, 7px)',
            background: 'radial-gradient(circle, #FFC0CB, #FFB6C1)',
            borderRadius: '80% 50% 20% 50%',
            animation: `blossomBloom 1.5s ease-out ${branch.growthDelay + 1500}ms both`,
          }} />
        </div>
      ))}

      {/* Cherry blossom gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(to bottom, 
            rgba(255, 182, 193, 0.3),
            rgba(255, 192, 203, 0.2),
            transparent
          )`,
          borderRadius: '12px 12px 0 0',
          pointerEvents: 'none',
          zIndex: 2,
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
        {/* Time and Mission Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'clamp(12px, 3vw, 20px)',
          color: 'rgba(139, 69, 19, 0.8)',
          fontSize: 'clamp(0.6rem, 1.6vw, 0.75rem)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: 'clamp(6px, 1.5vw, 8px)',
              height: 'clamp(6px, 1.5vw, 8px)',
              background: 'rgba(255, 105, 180, 0.9)',
              borderRadius: '50%',
              animation: 'sakuraPulse 2s infinite'
            }}/>
            ACTIVE
          </div>
          <div>{formatTime(currentTime)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            🌸 Mission Mode
          </div>
        </div>

        {/* Main Cherry Blossom Icons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 'clamp(12px, 3vw, 20px)', 
          marginBottom: 'clamp(12px, 3vw, 20px)',
          animation: 'iconFloat 4s infinite ease-in-out'
        }}>
          {/* Cherry Tree Icon */}
          <div
            style={{
              width: 'clamp(50px, 12vw, 70px)',
              height: 'clamp(50px, 12vw, 70px)',
              background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.9), rgba(255, 105, 180, 1))',
              borderRadius: '12px',
              position: 'relative',
              boxShadow: '0 6px 16px rgba(255, 105, 180, 0.5)',
              animation: 'treeSway 5s infinite ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(20px, 5vw, 30px)',
            }}
          >
            🌸
            {/* Tree trunk */}
            <div style={{
              position: 'absolute',
              bottom: 'clamp(8px, 2vw, 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(8px, 2vw, 12px)',
              height: 'clamp(12px, 3vw, 18px)',
              background: 'linear-gradient(to bottom, #8B4513, #A0522D)',
              borderRadius: '0 0 3px 3px',
            }} />
          </div>

          {/* Mission Progress Icon */}
          <div
            style={{
              width: 'clamp(45px, 10vw, 60px)',
              height: 'clamp(45px, 10vw, 60px)',
              background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.9), rgba(219, 112, 147, 1))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(18px, 4.5vw, 24px)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 6px 16px rgba(255, 20, 147, 0.5)',
              animation: 'missionPulse 3s infinite ease-in-out',
            }}
          >
            🎯
          </div>

          {/* Completion Circle */}
          <div
            style={{
              width: 'clamp(45px, 10vw, 60px)',
              height: 'clamp(45px, 10vw, 60px)',
              background: 'linear-gradient(135deg, rgba(255, 192, 203, 0.9), rgba(255, 182, 193, 1))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 6px 16px rgba(255, 192, 203, 0.5)',
              animation: 'completionSpin 4s infinite linear',
            }}
          >
            <svg width="60%" height="60%" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(139, 69, 19, 0.3)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8B4513"
                strokeWidth="2"
                strokeDasharray="68, 100"
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              color: '#8B4513',
              fontSize: 'clamp(8px, 2vw, 10px)',
              fontWeight: 'bold'
            }}>
              68%
            </div>
          </div>
        </div>

        <div
          style={{
            color: '#DC143C',
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            fontWeight: 'bold',
            marginBottom: 'clamp(6px, 1.5vw, 10px)',
            textShadow: '0 0 20px rgba(220, 20, 60, 0.7)',
            animation: 'cherryGlow 3s infinite ease-in-out',
            letterSpacing: 'clamp(0.5px, 0.3vw, 2px)',
            lineHeight: '1.2',
          }}
        >
          CHERRY BLOSSOM MISSIONS
        </div>

        <div style={{ 
          color: '#8B4513', 
          fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', 
          marginBottom: 'clamp(12px, 3vw, 20px)',
          opacity: 0.9,
          lineHeight: '1.4',
        }}>
          Experience seasonal beauty through guided adventures
        </div>
      </div>

      {/* Missions Preview Section */}
      <div style={{
        width: '100%',
        padding: '0 clamp(12px, 3vw, 20px)',
        position: 'relative',
        zIndex: 5,
      }}>
        <div style={{
          background: 'rgba(255, 192, 203, 0.3)',
          borderRadius: '10px',
          padding: 'clamp(8px, 2vw, 12px)',
          border: '1px solid rgba(255, 182, 193, 0.4)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
            color: '#DC143C',
            fontWeight: 'bold',
            marginBottom: 'clamp(6px, 1.5vw, 10px)',
            textAlign: 'center'
          }}>
            MISSION PROGRESS
          </div>
          
          {missions.slice(0, 3).map((mission, index) => (
            <div key={mission.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(4px, 1vw, 6px)',
              padding: 'clamp(4px, 1vw, 6px)',
              background: 'rgba(255, 105, 180, 0.1)',
              borderRadius: '6px',
              animation: `slideInPink 0.5s ease-out ${index * 0.1}s both`
            }}>
              <div style={{
                fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                color: '#8B4513',
                flex: 1,
                textAlign: 'left'
              }}>
                {mission.title}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: 'clamp(30px, 8vw, 40px)',
                  height: 'clamp(2px, 0.5vw, 3px)',
                  background: 'rgba(255, 192, 203, 0.5)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${mission.progress}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, #FF69B4, #FFB6C1)`,
                    borderRadius: '2px',
                    animation: 'missionFill 1s ease-out'
                  }} />
                </div>
                <span style={{
                  fontSize: 'clamp(0.5rem, 1.3vw, 0.6rem)',
                  color: '#DC143C',
                  minWidth: 'clamp(20px, 5vw, 25px)',
                  textAlign: 'right'
                }}>
                  {mission.progress}%
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
                background: 'linear-gradient(135deg, #FF69B4, #DC143C)',
                borderRadius: '50% 20% 50% 80%',
                margin: '0 auto 4px',
                animation: 'petalSpin 2s infinite',
                boxShadow: '0 0 10px rgba(255, 105, 180, 0.9)',
              }}
            />
            <div style={{ 
              color: '#DC143C', 
              fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
              whiteSpace: 'nowrap'
            }}>
              BLOOMING
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                width: 'clamp(10px, 2.5vw, 14px)',
                height: 'clamp(10px, 2.5vw, 14px)',
                background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
                borderRadius: '80% 50% 20% 50%',
                margin: '0 auto 4px',
                animation: 'petalSpin 2.5s infinite',
                animationDelay: '0.8s',
                boxShadow: '0 0 10px rgba(255, 182, 193, 0.9)',
              }}
            />
            <div style={{ 
              color: '#FF69B4', 
              fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
              whiteSpace: 'nowrap'
            }}>
              12 MISSIONS
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                width: 'clamp(10px, 2.5vw, 14px)',
                height: 'clamp(10px, 2.5vw, 14px)',
                background: 'linear-gradient(135deg, #FFC0CB, #FFB6C1)',
                borderRadius: '50% 80% 50% 20%',
                margin: '0 auto 4px',
                animation: 'petalSpin 2.2s infinite',
                animationDelay: '1.5s',
                boxShadow: '0 0 10px rgba(255, 192, 203, 0.9)',
              }}
            />
            <div style={{ 
              color: '#FFB6C1', 
              fontSize: 'clamp(0.5rem, 1.4vw, 0.65rem)',
              whiteSpace: 'nowrap'
            }}>
              5 COMPLETE
            </div>
          </div>
        </div>

        {/* Enhanced Blossom Progress Wave */}
        <div
          style={{
            background: 'rgba(255, 192, 203, 0.4)',
            borderRadius: '12px',
            height: 'clamp(6px, 1.5vw, 8px)',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(255, 182, 193, 0.5)',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #DC143C, #FF69B4, #FFB6C1, #FF69B4, #DC143C)',
              borderRadius: '12px',
              animation: 'sakuraWave 3s infinite ease-in-out',
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
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 182, 193, 0.4) 50%, transparent 100%)',
              animation: 'shimmerPink 2s infinite ease-in-out',
            }}
          />
        </div>
        
        <div style={{ 
          color: '#DC143C', 
          fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', 
          marginTop: 'clamp(4px, 1vw, 6px)', 
          opacity: 0.9,
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          Mission Module: Sakura Season Activated 🌸
        </div>
      </div>

      {/* Floating cherry blossom elements */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(15px, 4vw, 25px)',
          right: 'clamp(15px, 4vw, 25px)',
          width: 'clamp(10px, 2.5vw, 14px)',
          height: 'clamp(10px, 2.5vw, 14px)',
          background: 'radial-gradient(circle, #FFB6C1, #FF69B4)',
          borderRadius: '50% 20% 50% 80%',
          animation: 'blossomFloat1 4s infinite ease-in-out',
          boxShadow: '0 0 8px rgba(255, 105, 180, 0.9)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(15px, 4vw, 25px)',
          left: 'clamp(15px, 4vw, 25px)',
          width: 'clamp(8px, 2vw, 12px)',
          height: 'clamp(8px, 2vw, 12px)',
          background: 'radial-gradient(circle, #FFC0CB, #FFB6C1)',
          borderRadius: '80% 50% 20% 50%',
          animation: 'blossomFloat2 3.5s infinite ease-in-out',
          animationDelay: '1.5s',
          boxShadow: '0 0 6px rgba(255, 182, 193, 0.9)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 'clamp(10px, 3vw, 15px)',
          width: 'clamp(6px, 1.5vw, 9px)',
          height: 'clamp(6px, 1.5vw, 9px)',
          background: 'radial-gradient(circle, #FF69B4, #DC143C)',
          borderRadius: '50% 80% 50% 20%',
          animation: 'blossomFloat3 4.5s infinite ease-in-out',
          animationDelay: '2s',
          boxShadow: '0 0 4px rgba(220, 20, 60, 0.9)',
        }}
      />

      <style jsx>{`
        @keyframes petalFloat {
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

        @keyframes cherryBloom {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes branchGrow {
          0% { 
            height: 0; 
            opacity: 0.8; 
          }
          100% { 
            height: clamp(50px, 12vh, 80px); 
            opacity: 1; 
          }
        }

        @keyframes blossomBloom {
          0% { 
            transform: scale(0) rotate(0deg); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1) rotate(15deg); 
            opacity: 1; 
          }
        }

        @keyframes cherryGlow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(220, 20, 60, 0.7), 0 0 30px rgba(220, 20, 60, 0.5);
          }
          50% { 
            text-shadow: 0 0 30px rgba(220, 20, 60, 1), 0 0 40px rgba(220, 20, 60, 0.7), 0 0 50px rgba(255, 105, 180, 0.5);
          }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }

        @keyframes missionPulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 6px 16px rgba(255, 20, 147, 0.5);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 8px 20px rgba(255, 20, 147, 0.7);
          }
        }

        @keyframes completionSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes blossomFloat1 {
          0% { opacity: 0.7; transform: translateY(0) scale(1) rotate(0deg); }
          50% { opacity: 1; transform: translateY(clamp(-15px, -4vw, -20px)) scale(1.1) rotate(180deg); }
          100% { opacity: 0.7; transform: translateY(0) scale(1) rotate(360deg); }
        }

        @keyframes blossomFloat2 {
          0% { opacity: 0.7; transform: translateY(0) scale(1) rotate(0deg); }
          50% { opacity: 1; transform: translateY(clamp(-12px, -3vw, -18px)) scale(1.1) rotate(-180deg); }
          100% { opacity: 0.7; transform: translateY(0) scale(1) rotate(-360deg); }
        }

        @keyframes blossomFloat3 {
          0% { opacity: 0.7; transform: translateX(0) scale(1) rotate(0deg); }
          50% { opacity: 1; transform: translateX(clamp(8px, 2vw, 12px)) scale(1.1) rotate(90deg); }
          100% { opacity: 0.7; transform: translateX(0) scale(1) rotate(180deg); }
        }

        @keyframes petalSpin {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.2) rotate(180deg); 
          }
        }

        @keyframes sakuraWave {
          0%, 100% { 
            transform: translateX(-20px); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }

        @keyframes shimmerPink {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes sakuraPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes slideInPink {
          0% { opacity: 0; transform: translateX(-15px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes missionFill {
          0% { width: 0%; }
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          @keyframes petalFloat {
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

          @keyframes branchGrow {
            0% { 
              height: 0; 
              opacity: 0.8; 
            }
            100% { 
              height: 35px; 
              opacity: 1; 
            }
          }

          @keyframes blossomFloat1 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-12px) rotate(180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-24px) rotate(360deg) scale(0); }
          }

          @keyframes blossomFloat2 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-10px) rotate(-180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-20px) rotate(-360deg) scale(0); }
          }

          @keyframes blossomFloat3 {
            0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateX(6px) rotate(90deg) scale(1); }
            100% { opacity: 0; transform: translateX(12px) rotate(180deg) scale(0); }
          }
        }

        /* Tablet optimizations */
        @media (min-width: 481px) and (max-width: 768px) {
          @keyframes branchGrow {
            0% { 
              height: 0; 
              opacity: 0.8; 
            }
            100% { 
              height: 60px; 
              opacity: 1; 
            }
          }

          @keyframes blossomFloat1 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-20px) rotate(180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) rotate(360deg) scale(0); }
          }

          @keyframes blossomFloat2 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-16px) rotate(-180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-32px) rotate(-360deg) scale(0); }
          }

          @keyframes blossomFloat3 {
            0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateX(12px) rotate(90deg) scale(1); }
            100% { opacity: 0; transform: translateX(24px) rotate(180deg) scale(0); }
          }
        }

        /* Large desktop optimizations */
        @media (min-width: 1200px) {
          @keyframes branchGrow {
            0% { 
              height: 0; 
              opacity: 0.8; 
            }
            100% { 
              height: 80px; 
              opacity: 1; 
            }
          }

          @keyframes blossomFloat1 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-25px) rotate(180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) rotate(360deg) scale(0); }
          }

          @keyframes blossomFloat2 {
            0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateY(-20px) rotate(-180deg) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) rotate(-360deg) scale(0); }
          }

          @keyframes blossomFloat3 {
            0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0); }
            50% { opacity: 1; transform: translateX(15px) rotate(90deg) scale(1); }
            100% { opacity: 0; transform: translateX(30px) rotate(180deg) scale(0); }
          }
        }
      `}</style>
    </div>
  );
};

const panelBase = {
  background: 'rgba(255, 182, 193, 0.6)',
  border: '1px solid rgba(255, 182, 193, 0.5)',
  borderRadius: '12px',
  padding: 'clamp(12px, 3vw, 18px)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'inset 0 0 25px rgba(255, 182, 193, 0.15), 0 15px 40px rgba(0,0,0,0.2)',
};

export default BloosomPanel;