// src/components/LockedThemes.jsx
import React, { useState, useEffect } from 'react';
import { panelBase, superim, superimHeading } from '../../assets/Constants';

// Theme data
const themes = [
    {
        id: 1,
        img: '/assets/thumb1.png',
        unlock: 'Theme 2',
        description: 'Industrial Wasteland'
    },
    {
        id: 2,
        img: '/assets/thumb2.png',
        unlock: 'Theme 3',
        description: 'Ocean Pollution'
    },
    {
        id: 3,
        img: '/assets/thumb3.png',
        unlock: 'Theme 4',
        description: 'Urban Decay'
    },
    {
        id: 4,
        img: '/assets/thumb4.png',
        unlock: 'Theme 5',
        description: 'Nuclear Aftermath'
    },
];

const TrialLockedThemes = ({ 
        playHover, 
        playAction,
        themeno,
        ButtonBackground,
        ButtonBorder,
        ButtonColor,
        ButtonMouseOverBackground,
        ButtonMouseOverBorder
    }) => {
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Responsive breakpoints
    const isMobile = windowWidth < 480;
    const isTablet = windowWidth >= 480 && windowWidth < 768;
    const isDesktop = windowWidth >= 768;

    // Navigation functions with transition handling
    const navigateToTheme = (newIndex, direction = 'next') => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex(newIndex);
        playAction?.();

        setTimeout(() => setIsTransitioning(false), 400);
    };

    const prevTheme = () => {
        const newIndex = activeIndex === 0 ? themes.length - 1 : activeIndex - 1;
        navigateToTheme(newIndex, 'prev');
    };

    const nextTheme = () => {
        const newIndex = activeIndex === themes.length - 1 ? 0 : activeIndex + 1;
        navigateToTheme(newIndex, 'next');
    };

    // Get responsive dimensions
    const getCarouselDimensions = () => {
        if (isMobile) {
            return {
                containerHeight: '140px',
                centerCard: { width: '200px', height: '110px' },
                sideCard: { width: '140px', height: '90px' },
                sideOffset: '45px'
            };
        } else if (isTablet) {
            return {
                containerHeight: '160px',
                centerCard: { width: '220px', height: '120px' },
                sideCard: { width: '160px', height: '100px' },
                sideOffset: '55px'
            };
        } else {
            return {
                containerHeight: '180px',
                centerCard: { width: '240px', height: '130px' },
                sideCard: { width: '180px', height: '110px' },
                sideOffset: '60px'
            };
        }
    };

    const dimensions = getCarouselDimensions();

    // Theme card component
    const ThemeCard = ({ theme, position, onClick, dimensions: cardDims }) => {
        const isCenter = position === 'center';
        const isLeft = position === 'left';

        const cardStyle = {
            width: isCenter ? cardDims.centerCard.width : cardDims.sideCard.width,
            height: isCenter ? cardDims.centerCard.height : cardDims.sideCard.height,
            borderRadius: isCenter ? '15px' : '12px',
            background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${theme.img}) center/cover no-repeat`,
            position: 'absolute',
            ...(isLeft ? { left: `-${cardDims.sideOffset}` } : isCenter ? {
                left: '50%',
                transform: 'translateX(-50%) scale(1) rotateY(0deg)'
            } : { right: `-${cardDims.sideOffset}` }),
            // boxShadow: isCenter
            //     ? '0 15px 40px rgba(0,0,0,0.7), 0 0 0 3px rgba(120,180,130,0.4)'
            //     : '0 8px 25px rgba(0,0,0,0.4)',
            // border: isCenter
            //     ? '2px solid rgba(120,180,130,0.6)'
            //     : '2px solid rgba(60,110,70,0.3)',
            // opacity: isCenter ? 1 : 0.6,
            transform: isCenter
                ? 'translateX(-50%) scale(1) rotateY(0deg)'
                : `scale(0.85) rotateY(${isLeft ? '25deg' : '-25deg'})`,
            zIndex: isCenter ? 3 : 1,
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
        };

        const labelStyle = {
            position: 'absolute',
            bottom: isCenter ? '10px' : '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isCenter
                ? 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,40,25,0.9))'
                : 'rgba(0,0,0,0.8)',
            borderRadius: isCenter ? '8px' : '6px',
            padding: isCenter ? '6px 12px' : '4px 8px',
            color: '#ffd966',
            fontSize: isCenter ? (isMobile ? '0.75em' : '0.85em') : (isMobile ? '0.65em' : '0.7em'),
            fontWeight: 'bold',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            border: isCenter ? '1px solid rgba(255,217,102,0.3)' : 'none',
            maxWidth: '90%',
        };

        return (
            <div
                style={cardStyle}
                onClick={() => {
                    onClick();
                    playHover?.();
                }}
                onMouseEnter={() => playHover?.()}
            >
                {/* Theme preview overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)',
                    borderRadius: 'inherit'
                }} />

                {/* Lock icon and theme name */}
                <div style={labelStyle}>
                    🔒 {theme.unlock}
                </div>


            </div>
        );
    };

    // Navigation button component
    const NavButton = ({ direction, onClick }) => {
        const isLeft = direction === 'left';

        return (
            <button
                onClick={() => {
                    onClick();
                    playAction?.();
                }}
                onMouseEnter={() => playHover?.()}
                style={{
                    position: 'absolute',
                    top: '50%',
                    [isLeft ? 'left' : 'right']: isMobile ? '4px' : '8px',
                    transform: 'translateY(-50%)',
                    background: `${ButtonBackground}`,
                    border: `2px solid ${ButtonBorder}`,
                    borderRadius: '50%',
                    width: isMobile ? '32px' : '26px',
                    height: isMobile ? '32px' : '26px',
                    cursor: 'pointer',
                    color: `${ButtonColor}`,
                    fontSize: isMobile ? '1.2em' : '1em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 4,
                    fontFamily: 'inherit',
                    outline: 'none',
                }}
                onMouseOver={(e) => {
                    e.target.style.background = `${ButtonMouseOverBackground}`;
                    e.target.style.borderColor = `${ButtonMouseOverBorder}`;
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    e.target.style.boxShadow = '0 0 20px rgba(120,180,130,0.4)';
                }}
                onMouseOut={(e) => {
                    e.target.style.background = 'rgba(20,40,25,0.8)';
                    e.target.style.borderColor = 'rgba(60,110,70,0.5)';
                    e.target.style.transform = 'translateY(-50%)';
                    e.target.style.boxShadow = 'none';
                }}
            >
                {isLeft ? '‹' : '›'}
            </button>
        );
    };

    return (
        <div
            style={{
                ...superim[themeno],
                position: 'relative',
                overflow: 'hidden',
                minHeight: isMobile ? '200px' : isTablet ? '240px' : '280px',
                maxHeight: isMobile ? '250px' : isTablet ? '300px' : '300px',
                padding: isMobile ? '8px' : '12px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <div
                style={{
                    ...superimHeading[themeno],
                    fontSize: isMobile ? '0.85em' : '1em',
                    textAlign: 'center',
                    letterSpacing: isMobile ? '1px' : '1.5px',
                }}
            >
                Next Locked Themes
            </div>

            {/* Carousel Container */}
            <div
                style={{
                    position: 'relative',
                    height: dimensions.containerHeight,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    perspective: '1200px',
                    flex: 1,
                }}
            >
                {/* Theme Cards */}
                <ThemeCard
                    theme={themes[(activeIndex - 1 + themes.length) % themes.length]}
                    position="left"
                    onClick={prevTheme}
                    dimensions={dimensions}
                />

                <ThemeCard
                    theme={themes[activeIndex]}
                    position="center"
                    onClick={() => { }} // Center card doesn't navigate
                    dimensions={dimensions}
                />

                <ThemeCard
                    theme={themes[(activeIndex + 1) % themes.length]}
                    position="right"
                    onClick={nextTheme}
                    dimensions={dimensions}
                />

                {/* Navigation Buttons */}
                <NavButton direction="left" onClick={prevTheme} />
                <NavButton direction="right" onClick={nextTheme} />
            </div>
        </div>
    );
};

export default TrialLockedThemes;