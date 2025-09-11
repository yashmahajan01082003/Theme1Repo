import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { panelBase } from '../../assets/Constants';
import plastic_bottle from '../../../public/assets/plastic_bottle.png'

// Keyframes
const textGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 10px rgba(255, 71, 87, 0.5), 0 0 20px rgba(255, 71, 87, 0.3);
  }
  50% { 
    text-shadow: 0 0 20px rgba(255, 71, 87, 0.8), 0 0 30px rgba(255, 71, 87, 0.5), 0 0 40px rgba(255, 71, 87, 0.3);
  }
`;

const badgeFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const statusBlink = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
`;

const progressPulse = keyframes`
  0%, 100% { transform: translateX(-10px); opacity: 0.8; }
  50% { transform: translateX(0); opacity: 1; }
`;

const borderSweep = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(500%) rotate(45deg); }
`;

const stripeMove = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(40px); }
`;

const particle1 = keyframes`
  0% { opacity: 0; transform: translateY(0) scale(0); }
  50% { opacity: 1; transform: translateY(-20px) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(0); }
`;

const particle2 = keyframes`
  0% { opacity: 0; transform: translateY(0) scale(0); }
  50% { opacity: 1; transform: translateY(-15px) scale(1); }
  100% { opacity: 0; transform: translateY(-30px) scale(0); }
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
  backdrop-filter: blur(6px);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 40px rgba(255, 62, 62, 0.3), inset 0 0 30px rgba(255, 100, 100, 0.1);
  }

  &:focus {
    outline: 2px solid rgba(255, 62, 62, 0.6);
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
  color: #ff4757;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
  animation: ${textGlow} 2s infinite ease-in-out;
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
  border: 2px solid rgba(255, 62, 62, 0.3);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: all 0.3s ease;

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
`;

const Description = styled.div`
  color: #a7b5a8;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
`;

const ListenButton = styled.button`
  padding: 8px 20px;
  background: rgba(255, 62, 62, 0.25);
  border-radius: 18px;
  border: 1px solid rgba(255, 62, 62, 0.4);
  color: #ff9292;
  cursor: pointer;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  font-weight: bold;
  transition: all 0.3s ease;
  animation: ${badgeFloat} 2s infinite ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  outline: none;
  min-width: 80px;

  &:hover {
    background: rgba(255, 62, 62, 0.4);
    color: #fff;
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid rgba(255, 62, 62, 0.6);
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
  animation: ${statusBlink} 1s infinite;

  ${props => props.ready && css`
    background: #ff4757;
    box-shadow: 0 0 6px rgba(255, 71, 87, 0.6);
  `}

  ${props => props.videos && css`
    background: #ffa502;
    box-shadow: 0 0 6px rgba(255, 165, 2, 0.6);
    animation-delay: 0.5s;
    animation-duration: 1.5s;
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
  color: ${props => props.ready ? '#ff6b7a' : '#ffb84d'};
`;

const ProgressContainer = styled.div`
  width: 100%;
`;

const ProgressBar = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  height: 4px;
  overflow: hidden;
  width: 100%;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff4757, #ff6b7a, #ff4757);
  border-radius: 8px;
  animation: ${progressPulse} 2s infinite ease-in-out;
  width: 90%;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ProgressLabel = styled.div`
  color: #ff9292;
  font-size: clamp(0.65rem, 1.8vw, 0.7rem);
  margin-top: 0.5rem;
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
    rgba(255, 62, 62, 0.1) 50%, 
    transparent 60%
  );
  animation: ${borderSweep} 3s infinite linear;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StripesEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 62, 62, 0.03) 10px,
    rgba(255, 62, 62, 0.03) 20px
  );
  border-radius: 12px;
  pointer-events: none;
  animation: ${stripeMove} 4s infinite linear;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  ${props => props.type === 1 && css`
    top: 12px;
    right: 12px;
    width: 4px;
    height: 4px;
    background: #ff4757;
    animation: ${particle1} 3s infinite ease-in-out;
    box-shadow: 0 0 4px rgba(255, 71, 87, 0.8);

    @media screen and (max-width: 480px) {
      top: 8px;
      right: 8px;
      width: 3px;
      height: 3px;
    }
  `}

  ${props => props.type === 2 && css`
    bottom: 16px;
    left: 16px;
    width: 3px;
    height: 3px;
    background: #ff6b7a;
    animation: ${particle2} 2.5s infinite ease-in-out;
    animation-delay: 1s;
    box-shadow: 0 0 3px rgba(255, 107, 122, 0.8);

    @media screen and (max-width: 480px) {
      bottom: 12px;
      left: 12px;
      width: 2px;
      height: 2px;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const VideosPanel = ({ onVideoSelect }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const navigate = useNavigate();

  const videos = [
    { id: 1, title: 'Survivor Story 1', thumbnail: plastic_bottle, url: '/assets/login.mp4' },
    { id: 2, title: 'Survivor Story 2', thumbnail: plastic_bottle, url: 'video2.mp4' },
    { id: 3, title: 'Disaster Aftermath', thumbnail: plastic_bottle, url: 'video3.mp4' },
    { id: 4, title: 'Rescue Mission', thumbnail: plastic_bottle, url: 'video4.mp4' },
  ];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIntensity(0.7 + Math.random() * 0.6);
    }, 2000);

    return () => clearInterval(pulseInterval);
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
          rgba(255, 62, 62, ${0.25 * pulseIntensity}), 
          rgba(255, 62, 62, 0.05),
          rgba(255, 100, 100, ${0.15 * pulseIntensity})
        )`,
        border: `2px solid rgba(255, 62, 62, ${0.6 + 0.4 * pulseIntensity})`,
        transform: glitchActive ? 'translateX(2px) skew(0.5deg)' : 'none',
        filter: glitchActive ? 'hue-rotate(10deg) saturate(1.3)' : 'none',
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
      <StripesEffect />

      <ContentContainer>
        <Title>
          {glitchActive ? 'W̴H̷A̸T̴ ̵I̷F̶ ̴I̷ ̶C̸O̴U̵L̷D̶ ̴S̷P̵E̸A̶K̴' : 'WHAT IF I COULD SPEAK'}
        </Title>

        <ImageContainer>
          <ImageBox
            style={{
              filter: glitchActive ? 'hue-rotate(5deg) saturate(1.1)' : 'none',
            }}
          />
        </ImageContainer>

        <Description>
          See how victims' pains look like...
        </Description>

        <ListenButton onClick={handleListenClick}>
          Listen
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

      <Particle type={1} />
      <Particle type={2} />
    </PanelContainer>
  );
};

export default VideosPanel;