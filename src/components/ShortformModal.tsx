import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Ticket, Sparkles } from 'lucide-react';
import { SynergyPackage } from '../types/synergy';

interface ShortformModalProps {
  pkg: SynergyPackage | null;
  onClose: () => void;
  onSelectForBooking: (pkg: SynergyPackage) => void;
}

export const ShortformModal: React.FC<ShortformModalProps> = ({
  pkg,
  onClose,
  onSelectForBooking,
}) => {
  if (!pkg) return null;

  const clips = pkg.shortformClips || [];
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-progress timer for clips
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next clip or loop
            setCurrentClipIndex((idx) => (idx + 1) % clips.length);
            return 0;
          }
          return prev + 2; // ~5 seconds per clip
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, clips.length, currentClipIndex]);

  const activeClip = clips[currentClipIndex] || {
    title: pkg.title,
    subtitle: pkg.tagline,
    bgImage: pkg.heroImage,
  };

  const handleNext = () => {
    setCurrentClipIndex((idx) => (idx + 1) % clips.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentClipIndex((idx) => (idx - 1 + clips.length) % clips.length);
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-md h-[88vh] max-h-[760px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10">
        {/* Background Image of current clip */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeClip.bgImage}
            alt={activeClip.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-700 scale-105"
          />
          {/* Gradients for high readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/20 to-black/60" />
        </div>

        {/* Top Controls: Segmented Progress Bar */}
        <div className="relative z-20 p-4 space-y-3">
          <div className="flex items-center gap-1.5 w-full">
            {clips.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                onClick={() => {
                  setCurrentClipIndex(i);
                  setProgress(0);
                }}
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width:
                      i < currentClipIndex
                        ? '100%'
                        : i === currentClipIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider bg-rose-600 px-2.5 py-0.5 rounded text-white shadow-sm">
                NOL 30초 숏폼
              </span>
              <span className="text-xs font-semibold text-white/90 truncate max-w-[170px]">
                {pkg.destinationLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mid Navigation Tap Zones */}
        <div className="relative z-10 flex-1 flex">
          <div
            className="w-1/3 h-full cursor-pointer group flex items-center pl-2"
            onClick={handlePrev}
          >
            <div className="w-8 h-8 rounded-full bg-black/30 group-hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </div>
          <div
            className="w-1/3 h-full cursor-pointer flex items-center justify-center"
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <div
            className="w-1/3 h-full cursor-pointer group flex items-center justify-end pr-2"
            onClick={handleNext}
          >
            <div className="w-8 h-8 rounded-full bg-black/30 group-hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Bottom Story Content & Booking Bar */}
        <div className="relative z-20 p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>클립 {currentClipIndex + 1} / {clips.length}</span>
            </div>
            <h3 className="text-xl font-black text-white leading-snug drop-shadow-md">
              {activeClip.title}
            </h3>
            <p className="text-xs text-slate-300 drop-shadow-sm font-medium">
              {activeClip.subtitle}
            </p>
          </div>

          {/* Synergy Card Overlay */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-center justify-between gap-3">
            <div className="truncate">
              <div className="text-[11px] text-white/70 font-medium truncate">
                {pkg.ticket.title} + {pkg.hotel.name}
              </div>
              <div className="text-base font-black text-white tabular-nums">
                {pkg.bundlePrice.toLocaleString()}원
                <span className="text-xs text-rose-400 ml-1.5 font-bold">
                  ({pkg.discountPercent}% 결합할인)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectForBooking(pkg);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs shrink-0 shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>패키지 예약</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
