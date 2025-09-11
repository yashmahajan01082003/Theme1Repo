import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { panelBase } from '../../assets/Constants';
import plastic_bottle from '../../../public/assets/plastic_bottle.png'

// Keyframes
const textGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 15px rgba(184, 124, 76, 0.6), 0 0 25px rgba(184, 124, 76, 0.4);
  }
  50% { 
    text-shadow: 0 0 25px rgba(184, 124, 76, 0.9), 0 0 35px rgba(184, 124, 76, 0.6), 0 0 45px rgba(184, 124, 76, 0.4);
  }
`;

const dustFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  50% { transform: translateY(-5px) rotate(2deg); opacity: 1; }
`;

const fogDrift = keyframes`
  0% { transform: translateX(-20px) scale(1); opacity: 0.3; }
  50% { transform: translateX(0) scale(1.1); opacity: 0.6; }
  100% { transform: translateX(20px) scale(1); opacity: 0.3; }
`;

const progressPulse = keyframes`
  0%, 100% { transform: translateX(-10px); opacity: 0.8; }
  50% { transform: translateX(0); opacity: 1; }
`;

const borderSweep = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(500%) rotate(45deg); }
`;

const dustParticle = keyframes`
  0% { opacity: 0; transform: translateY(0) scale(0) rotate(0deg); }
  50% { opacity: 0.8; transform: translateY(-25px) scale(1) rotate(180deg); }
  100% { opacity: 0; transform: translateY(-50px) scale(0) rotate(360deg); }
`;

const fogSwirl = keyframes`
  0% { opacity: 0; transform: translateY(0) scale(0.8) rotate(0deg); }
  50% { opacity: 0.6; transform: translateY(-20px) scale(1.2) rotate(90deg); }
  100% { opacity: 0; transform: translateY(-40px) scale(0.8) rotate(180deg); }
`;

// Styled Components
const PanelContainer = styled.div`
  border-radius: 12px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  backdrop-filter: blur(8px);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 40px rgba(184, 124, 76, 0.4), inset 0 0 30px rgba(235, 217, 209, 0.2);
  }

  &:focus {
    outline: 2px solid rgba(184, 124, 76, 0.7);
    outline-offset: 2px;
  }

  @media screen and (max-width: 768px) {
    min-height: 250px;
    padding: 0.75rem;
  }

  @media screen and (max-width: 480px) {
    min-height: 220px;
    padding: 0.5rem;
  }

  @media screen and (min-width: 1200px) {
    min-height: 350px;
    padding: 1.5rem;
  }
`;

const ContentContainer = styled.div`
  text-align: center;
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  @media screen and (max-width: 768px) {
    max-width: 100%;
    gap: 0.5rem;
  }

  @media screen and (min-width: 1200px) {
    max-width: 300px;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  color: #B87C4C;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: bold;
  text-shadow: 0 0 15px rgba(184, 124, 76, 0.6);
  animation: ${textGlow} 3s infinite ease-in-out;
  letter-spacing: 1px;
  word-break: break-word;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ImageBox = styled.div`
  width: 100%;
  max-width: 200px;
  height: 120px;
  background-image: url(${plastic_bottle});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  border: 2px solid rgba(184, 124, 76, 0.4);
  box-shadow: 0 4px 12px rgba(184, 124, 76, 0.3), inset 0 0 20px rgba(235, 217, 209, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(235, 217, 209, 0.2) 50%, transparent 70%);
    border-radius: 6px;
    animation: ${fogDrift} 4s infinite ease-in-out;
  }

  @media screen and (max-width: 768px) {
    height: 100px;
    max-width: 160px;
  }

  @media screen and (max-width: 480px) {
    height: 80px;
    max-width: 140px;
  }

  @media screen and (min-width: 1200px) {
    height: 140px;
    max-width: 240px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

const Description = styled.div`
  color: #9D7B66;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  opacity: 0.9;
`;

const ListenButton = styled.button`
  padding: 8px 20px;
  background: rgba(184, 124, 76, 0.3);
  border-radius: 18px;
  border: 1px solid rgba(184, 124, 76, 0.5);
  color: #4F200D;
  cursor: pointer;
  font-size: clamp(0.9rem, 2vw, 0.8rem);
  font-weight: bold;
  transition: all 0.3s ease;
  animation: ${dustFloat} 3s infinite ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  outline: none;
  min-width: 80px;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(184, 124, 76, 0.5);
    color: #EBD9D1;
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(184, 124, 76, 0.4);
  }

  &:focus {
    outline: 2px solid rgba(184, 124, 76, 0.7);
    outline-offset: 2px;
  }

  @media screen and (max-width: 768px) {
    padding: 6px 16px;
    min-width: 70px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(0.75rem, 3vw, 1rem);
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    gap: 0.75rem;
  }

  @media screen and (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const StatusItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: ${dustFloat} 2s infinite;

  ${props => props.ready && css`
    background: #B87C4C;
    box-shadow: 0 0 8px rgba(184, 124, 76, 0.7);
  `}

  ${props => props.videos && css`
    background: #D4A574;
    box-shadow: 0 0 8px rgba(212, 165, 116, 0.7);
    animation-delay: 0.5s;
    animation-duration: 2.5s;
  `}

  @media screen and (max-width: 480px) {
    width: 6px;
    height: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StatusLabel = styled.div`
  font-size: clamp(0.55rem, 1.5vw, 0.6rem);
  font-weight: bold;
  letter-spacing: 0.5px;
  color: ${props => props.ready ? '#B87C4C' : '#D4A574'};
`;

const ProgressContainer = styled.div`
  width: 100%;
`;

const ProgressBar = styled.div`
  background: rgba(184, 124, 76, 0.2);
  border-radius: 8px;
  height: 4px;
  overflow: hidden;
  width: 100%;
  box-shadow: inset 0 0 4px rgba(184, 124, 76, 0.3);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #B87C4C, #EBD9D1, #B87C4C);
  border-radius: 8px;
  animation: ${progressPulse} 3s infinite ease-in-out;
  width: 90%;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ProgressLabel = styled.div`
  color: #B87C4C;
  font-size: clamp(0.65rem, 1.8vw, 0.7rem);
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const BorderEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: linear-gradient(45deg, 
    transparent 40%, 
    rgba(235, 217, 209, 0.2) 50%, 
    transparent 60%
  );
  animation: ${borderSweep} 4s infinite linear;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FogEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, 
    rgba(235, 217, 209, 0.1) 0%, 
    rgba(184, 124, 76, 0.05) 50%,
    transparent 100%
  );
  border-radius: 12px;
  pointer-events: none;
  animation: ${fogDrift} 5s infinite ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const DustParticle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  ${props => props.type === 1 && css`
    top: 15px;
    right: 15px;
    width: 3px;
    height: 3px;
    background: #B87C4C;
    animation: ${dustParticle} 4s infinite ease-in-out;
    box-shadow: 0 0 6px rgba(184, 124, 76, 0.8);

    @media screen and (max-width: 480px) {
      top: 10px;
      right: 10px;
      width: 2px;
      height: 2px;
    }
  `}

  ${props => props.type === 2 && css`
    bottom: 20px;
    left: 20px;
    width: 4px;
    height: 4px;
    background: #EBD9D1;
    animation: ${fogSwirl} 3.5s infinite ease-in-out;
    animation-delay: 1.5s;
    box-shadow: 0 0 4px rgba(235, 217, 209, 0.8);

    @media screen and (max-width: 480px) {
      bottom: 15px;
      left: 15px;
      width: 3px;
      height: 3px;
    }
  `}

  ${props => props.type === 3 && css`
    top: 50%;
    left: 10px;
    width: 2px;
    height: 2px;
    background: #D4A574;
    animation: ${dustParticle} 3s infinite ease-in-out;
    animation-delay: 2s;
    box-shadow: 0 0 3px rgba(212, 165, 116, 0.8);

    @media screen and (max-width: 480px) {
      width: 1px;
      height: 1px;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const VRPanel = ({ onVideoSelect }) => {
  const [dustActive, setDustActive] = useState(false);
  const [fogIntensity, setFogIntensity] = useState(1);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const navigate = useNavigate();

  const videos = [
    { id: 1, title: 'Survivor Story 1', thumbnail: plastic_bottle, url: '/assets/login.mp4' },
    { id: 2, title: 'Survivor Story 2', thumbnail: plastic_bottle, url: 'video2.mp4' },
    { id: 3, title: 'Disaster Aftermath', thumbnail: plastic_bottle, url: 'video3.mp4' },
    { id: 4, title: 'Rescue Mission', thumbnail: plastic_bottle, url: 'video4.mp4' },
  ];

  useEffect(() => {
    const dustInterval = setInterval(() => {
      setDustActive(true);
      setTimeout(() => setDustActive(false), 200);
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(dustInterval);
  }, []);

  useEffect(() => {
    const fogInterval = setInterval(() => {
      setFogIntensity(0.8 + Math.random() * 0.4);
    }, 3000);

    return () => clearInterval(fogInterval);
  }, []);

  const handlePanelClick = () => {
    console.log('Speech interface activated!');
    setShowVideoModal(true);
    navigate('/videos');
  };

  const handleListenClick = (e) => {
    e.stopPropagation();
    setShowVideoModal(true);
  };

  return (
    <PanelContainer
      style={{
        ...panelBase,
        background: `linear-gradient(135deg, 
          rgba(184, 124, 76, ${0.3 * fogIntensity}), 
          rgba(235, 217, 209, ${0.15 * fogIntensity}),
          rgba(184, 124, 76, ${0.2 * fogIntensity})
        )`,
        border: `2px solid rgba(184, 124, 76, ${0.5 + 0.3 * fogIntensity})`,
        transform: dustActive ? 'translateX(1px) skew(0.3deg)' : 'none',
        filter: dustActive ? 'sepia(0.1) saturate(1.1)' : 'none',
      }}
      onClick={handlePanelClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handlePanelClick();
        }
      }}
    >
      <BorderEffect />
      <FogEffect />

      <ContentContainer>
        <Title>
          {dustActive ? 'W̴H̷A̸T̴ ̵I̷F̶ ̴D̷U̶S̸T̴ ̵S̷P̵E̸A̶K̴S̴' : 'WHAT IF YOU IGNORE NATURE'}
        </Title>

        <ImageContainer>
          <ImageBox
            style={{
              filter: dustActive ? 'sepia(0.2) saturate(1.2)' : 'sepia(0.1)',
            }}
          />
        </ImageContainer>

        <Description>
          Experience the natural disasters...
        </Description>

        <ListenButton onClick={handleListenClick}>
          Enter VR
        </ListenButton>

        <StatusContainer>
          <StatusItem>
            <StatusDot ready />
            <StatusLabel ready>READY</StatusLabel>
          </StatusItem>
          <StatusItem>
            <StatusDot videos />
            <StatusLabel>4 VIDEOS</StatusLabel>
          </StatusItem>
        </StatusContainer>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill />
          </ProgressBar>
          <ProgressLabel>
            Video Library: Ready
          </ProgressLabel>
        </ProgressContainer>
      </ContentContainer>

      <DustParticle type={1} />
      <DustParticle type={2} />
      <DustParticle type={3} />
    </PanelContainer>
  );
};

export default VRPanel;