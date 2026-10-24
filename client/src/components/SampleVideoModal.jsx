import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Volume2, Loader2 } from 'lucide-react';

export default function SampleVideoModal({ isOpen, onClose, videoUrl, poster, title }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  // Derive poster from videoUrl if poster not provided and it's a Cloudinary video
  const resolvedPoster =
    poster ||
    (videoUrl && videoUrl.includes('cloudinary.com')
      ? videoUrl.replace(/\/video\/upload\/.*?\//, '/video/upload/c_scale,f_auto,q_auto,so_1,w_600/').replace(/\.mp4$/i, '.jpg')
      : undefined);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#160309]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-sm sm:max-w-md bg-[#25070f] border-2 border-[#d4a85a]/40 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#2a0812] via-[#3d0f1b] to-[#2a0812] border-b border-[#d4a85a]/25 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden pr-2">
              <Sparkles className="w-4 h-4 text-[#d4a85a] animate-spin shrink-0" />
              <h3 className="font-heading text-xs sm:text-sm font-bold text-[#faf6f0] truncate">
                {title || 'Royal Wedding Invitation Preview'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#faf6f0]/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 9:16 Video Player Container */}
          <div className="relative aspect-[9/16] max-h-[72vh] bg-black mx-auto overflow-hidden w-full flex items-center justify-center">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 text-white gap-2 backdrop-blur-[2px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4a85a]" />
                <span className="text-xs font-semibold tracking-wider text-[#faf6f0]/90">
                  Streaming 4K Video...
                </span>
              </div>
            )}

            <video
              src={videoUrl || 'https://res.cloudinary.com/vrljkq9h/video/upload/q_auto,vc_auto/Sample_1.mp4'}
              poster={resolvedPoster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onWaiting={() => setLoading(true)}
              onCanPlay={() => setLoading(false)}
              onPlaying={() => setLoading(false)}
              onLoadedData={() => setLoading(false)}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Footer note */}
          <div className="p-2.5 sm:p-3 bg-[#1a040b] text-center text-[11px] text-[#faf6f0]/80 border-t border-[#d4a85a]/20 flex items-center justify-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#d4a85a]" />
            <span>Turn on sound to enjoy authentic Shehnai & Sitar symphony</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
