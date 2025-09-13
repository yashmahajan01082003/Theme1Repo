// VideoPlayerDashboard.jsx
import React, { useEffect, useRef, useState } from 'react';
import GarbageDashboard from '../components/Theme1/T1Dashboard';

const VideoPlayerDashboard = () => {
  const [currentVideo, setCurrentVideo] = useState('/assets/T1Intro.mp4');
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardFadingIn, setDashboardFadingIn] = useState(false);
  const [videoFadingOut, setVideoFadingOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef(null);

  // 🔓 Unlock Web Audio API
  const unlockAudioContext = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') ctx.resume();
      }
    } catch (err) {
      console.warn('AudioContext unlock failed:', err);
    }
  };

  const handleInitialPlay = async () => {
    setUserInteracted(true);
    setShowPlayButton(false);
    setIsPlaying(true);
    unlockAudioContext();
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch {}
    }
  };

  const handleFullscreenChange = async () => {
    if (document.fullscreenElement) {
      setUserInteracted(true);
      setShowPlayButton(false);
      setIsPlaying(true);
      unlockAudioContext();
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch {}
      }
    }
  };

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      handleInitialPlay();
    }
  };

  const handleVideoEnd = () => {
    setVideoFadingOut(true);
    setTimeout(() => {
      setShowDashboard(true);
      requestAnimationFrame(() => setDashboardFadingIn(true));
    }, 700);
  };

  const playVideo = async (videoPath) => {
    setCurrentVideo(videoPath);
    setShowDashboard(false);
    setDashboardFadingIn(false);
    setVideoFadingOut(false);
    setIsPlaying(true);
    setTimeout(async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch {}
      }
    }, 100);
  };

  const closeDashboard = async () => {
    setShowDashboard(false);
    setDashboardFadingIn(false);
    setVideoFadingOut(false);
    if (videoRef.current && userInteracted) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) videoElement.addEventListener('ended', handleVideoEnd);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      if (videoElement) videoElement.removeEventListener('ended', handleVideoEnd);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && userInteracted) {
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying, currentVideo, userInteracted]);

  return (
    <div className="w-full min-h-screen overflow-hidden bg-black relative">
      {/* Video layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          videoFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <video
          ref={videoRef}
          src={currentVideo}
          className="w-full h-full object-cover"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={() =>
            videoRef.current && (videoRef.current.currentTime = 0)
          }
        />
      </div>

      {/* Fullscreen prompt */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-end justify-center pb-[env(safe-area-inset-bottom)] pb-12 z-40">
          <div className="text-center px-4">
            <p className="text-white text-sm md:text-base lg:text-lg mb-4 opacity-80 leading-snug" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Go fullscreen for the best experience
            </p>
            <button
              onClick={enterFullscreen}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white border-opacity-30 text-xs md:text-sm lg:text-base font-medium transition-all duration-300 backdrop-blur-sm"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Garbage Dashboard */}
      {showDashboard && (
        <div
          className={`absolute inset-0 z-50 transition-opacity duration-700 ease-out ${
            dashboardFadingIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <GarbageDashboard onClose={closeDashboard} onPlayVideo={playVideo} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayerDashboard;