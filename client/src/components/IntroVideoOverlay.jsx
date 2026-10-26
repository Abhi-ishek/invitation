import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, ArrowRight, Play } from 'lucide-react';
import introVideo from '../assets/Engagement Sample 7.mp4';

const TOTAL_DURATION_SEC = 15;

export default function IntroVideoOverlay() {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SEC);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Close and cleanup
  const handleClose = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // ignore
      }
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt autoplay with sound
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          setAudioBlocked(false);
        })
        .catch(() => {
          // Browser blocked unmuted autoplay, fallback to muted autoplay
          video.muted = true;
          setIsMuted(true);
          setAudioBlocked(true);
          video.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
    }

    // Precise 15-second countdown using requestAnimationFrame & timestamp
    startTimeRef.current = performance.now();

    const updateTimer = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, TOTAL_DURATION_SEC - elapsed);
      setTimeLeft(Math.ceil(remaining));

      if (elapsed >= TOTAL_DURATION_SEC) {
        handleClose();
      } else {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setAudioBlocked(false);
      videoRef.current.play().catch(() => {});
    }
  };

  const progressPercent = Math.min(100, Math.max(0, ((TOTAL_DURATION_SEC - timeLeft) / TOTAL_DURATION_SEC) * 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="intro-video-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#120308] text-white flex flex-col justify-between overflow-hidden select-none"
        >
          {/* Subtle Ambient Golden Glow in background */}
          {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d4a85a]/15 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#5a1030]/35 rounded-full blur-[130px]" />
          </div> */}

          {/* Top Progress Bar */}
          {/* <div className="relative w-full h-1.5 bg-black/50 z-20 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d4a85a] via-[#f5e4ce] to-[#d4a85a] shadow-[0_0_12px_rgba(212,168,90,0.8)]"
              style={{ width: `${progressPercent}%` }}
              transition={{ ease: 'linear', duration: 0.2 }}
            />
          </div>      */}

          {/* Top Header Bar */}
          <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Branding / Badge */}
            {/* <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d4a85a]/20 border border-[#d4a85a]/50 flex items-center justify-center text-[#d4a85a]">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading text-sm sm:text-base font-bold text-[#faf6f0] tracking-wide leading-tight">
                  Wedding Wishcraft
                </h1>
                <p className="text-[10px] sm:text-xs text-[#d4a85a] font-medium tracking-wider uppercase">
                  Royal Invitation Premiere
                </p>
              </div>
            </div> */}

            {/* Right actions: Audio Toggle & Skip Button */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-[#faf6f0] backdrop-blur-md transition-all active:scale-95"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#d4a85a]" />
                    <span className="hidden sm:inline">Mute</span>
                  </>
                )}
              </button>

              {/* Skip / Enter Website Button */}
              <button
                onClick={handleClose}
                type="button"
                className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4a85a] to-[#c49848] text-[#1a040b] font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,168,90,0.4)] hover:shadow-[0_0_25px_rgba(212,168,90,0.7)] transition-all hover:scale-105 active:scale-95"
              >
                <span>Enter Website</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#1a040b]/20 text-[11px] font-bold">
                  {timeLeft}s
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </header>

          {/* Central Video Frame */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-5 overflow-hidden">
            <div className="relative w-auto max-w-[94vw] h-[72vh] sm:h-[76vh] md:h-[80vh] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#d4a85a]/40 shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,168,90,0.25)] bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={introVideo}
                autoPlay
                playsInline
                preload="auto"
                onEnded={handleClose}
                className="w-full h-full object-contain bg-black"
              />

              {/* Autoplay Audio Notification Banner if browser muted autoplay */}
              {audioBlocked && isMuted && (
                <div
                  onClick={toggleSound}
                  className="absolute bottom-4 inset-x-4 cursor-pointer bg-black/80 hover:bg-black/90 border border-[#d4a85a]/60 text-white rounded-xl p-2.5 sm:p-3 text-center backdrop-blur-md transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <VolumeX className="w-4 h-4 text-[#d4a85a] animate-bounce shrink-0" />
                  <span className="text-xs font-medium text-[#faf6f0]">
                    Audio is muted by browser • <span className="text-[#d4a85a] underline font-semibold">Tap to Unmute</span>
                  </span>
                </div>
              )}
            </div>
          </main>

          {/* Bottom Bar with luxury prompt & countdown */}
          {/* <footer className="relative z-20 w-full px-4 py-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col sm:flex-row items-center justify-between text-center gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#faf6f0]/80">
              <span className="inline-block w-2 h-2 rounded-full bg-[#d4a85a] animate-ping" />
              <span>Playing wedding invite preview • Automatically entering in <strong className="text-[#d4a85a] font-bold">{timeLeft}s</strong></span>
            </div>

            <button
              onClick={handleClose}
              type="button"
              className="text-xs text-[#faf6f0]/60 hover:text-[#d4a85a] underline underline-offset-4 transition-colors"
            >
              Skip directly to shop & catalog &rarr;
            </button>
          </footer> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
