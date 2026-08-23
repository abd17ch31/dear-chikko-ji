import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, Heart } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface Scene1CountdownProps {
  yearsCount: number;
  partnerName: string;
  onCountdownComplete: () => void;
}

export const Scene1Countdown: React.FC<Scene1CountdownProps & { active?: boolean }> = ({
  yearsCount,
  partnerName,
  onCountdownComplete,
  active = true,
}) => {
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [isIgnited, setIsIgnited] = useState<boolean>(false);
  const [showBalloons, setShowBalloons] = useState<boolean>(false);
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

  // Number count up sequence initially
  useEffect(() => {
    let timeout: number;
    if (displayNumber < yearsCount) {
      timeout = window.setTimeout(() => {
        setDisplayNumber((prev) => prev + 1);
      }, 800); // Start slowly counting
    } else if (displayNumber === yearsCount && !hasReachedEnd) {
      setHasReachedEnd(true);
      onCountdownComplete(); // Notify parent that scrolling can be enabled
    }
    return () => clearTimeout(timeout);
  }, [displayNumber, yearsCount, hasReachedEnd, onCountdownComplete]);

  // Handle click on the big number
  const handleIgnite = () => {
    if (isIgnited || displayNumber !== yearsCount) return;

    setIsIgnited(true);

    // Play fire ignition audio FX
    soundFX.playFireIgnition();

    // Trigger confetti fireworks
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff4d4d', '#ffb300', '#ff66cc', '#33ecff', '#ffd700'],
    });

    // Start balloon rise sequence
    setTimeout(() => {
      setShowBalloons(true);
      setShowLetters(true);
      soundFX.playMagicChime();
    }, 800);
  };

  const balloons = [
    { color: 'from-rose-500 to-pink-600', left: '10%', delay: 0.1, size: 'w-16 h-20' },
    { color: 'from-amber-400 to-yellow-500', left: '22%', delay: 0.3, size: 'w-20 h-24' },
    { color: 'from-purple-500 to-indigo-600', left: '35%', delay: 0.5, size: 'w-16 h-20' },
    { color: 'from-emerald-400 to-teal-500', left: '50%', delay: 0.2, size: 'w-20 h-24' },
    { color: 'from-rose-400 to-red-500', left: '65%', delay: 0.4, size: 'w-16 h-20' },
    { color: 'from-sky-400 to-blue-600', left: '78%', delay: 0.6, size: 'w-20 h-24' },
    { color: 'from-fuchsia-400 to-pink-500', left: '90%', delay: 0.1, size: 'w-16 h-20' },
  ];

  return (
    <div className="relative h-full w-full bg-[#0d1326] flex flex-col items-center justify-center overflow-hidden select-none text-white px-4">
      {/* Background Star Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0d1326] to-[#080c19] pointer-events-none" />

      {/* Burning Flame Sparks Effect around center */}
      {isIgnited && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="w-64 h-64 bg-rose-500/30 rounded-full blur-2xl animate-ping" />
        </div>
      )}

      {/* Main Countdown Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl">
        {/* Main Interactive Number */}
        <div
          id="ignite-number-btn"
          onClick={handleIgnite}
          className={`relative group my-6 transition-transform duration-300 transform ${
            displayNumber === yearsCount && !isIgnited ? 'cursor-pointer hover:scale-105' : ''
          }`}
        >
          <motion.div
            key={displayNumber}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`text-8xl sm:text-[160px] md:text-[220px] font-extrabold tracking-tighter leading-none select-none transition-all duration-700 ${
              isIgnited
                ? 'text-transparent bg-clip-text bg-gradient-to-t from-amber-500 via-rose-500 to-amber-200 drop-shadow-[0_0_35px_rgba(255,100,50,0.8)]'
                : 'text-slate-100 drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] group-hover:text-amber-200'
            }`}
          >
            {displayNumber}
          </motion.div>

          {/* Prompt instruction before click, only after reaching 6 */}
          {!isIgnited && displayNumber === yearsCount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-2 text-xs sm:text-sm font-medium tracking-widest text-amber-300 uppercase flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Click to Ignite the Magic</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>
          )}

          {/* Flame Particle Overlay upon ignition */}
          {active && isIgnited && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Flame className="w-32 h-32 text-amber-400 animate-bounce blur-[2px] opacity-80" />
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex space-x-2 text-3xl">
                <span>🔥</span>
                <span>✨</span>
                <span>💖</span>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle Label */}
        <div className="mt-4">
          <p className="text-xs sm:text-sm font-bold tracking-[0.3em] text-slate-400 uppercase">
            COUNTING THE YEARS
          </p>
          <p className="text-sm sm:text-base text-rose-300/90 font-serif italic mt-1">
            {yearsCount} Years of Endless Love with {partnerName}
          </p>
        </div>

        {/* Floating Letters: HAPPY ANNIVERSARY (One Line) */}
        <AnimatePresence>
          {showLetters && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8 overflow-visible"
            >
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                animate={{ y: [0, -8, 0], opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                }}
                className="px-6 py-4 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 text-rose-200 backdrop-blur-md shadow-rose-500/10 shadow-lg text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-widest whitespace-nowrap"
              >
                HAPPY ANNIVERSARY
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Colorful Balloons Rising */}
      <AnimatePresence>
        {active && showBalloons && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {balloons.map((b, idx) => (
              <motion.div
                key={idx}
                initial={{ y: '100vh', opacity: 0.9 }}
                animate={{ y: '-120vh', opacity: [0.9, 1, 0.8] }}
                transition={{
                  duration: 8 + idx * 1.5,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ left: b.left }}
                className="absolute flex flex-col items-center"
              >
                {/* Balloon Body */}
                <div
                  className={`${b.size} rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${b.color} shadow-lg shadow-black/30 border border-white/30 relative flex items-center justify-center text-white/80 font-bold text-xs`}
                >
                  <div className="absolute top-2 left-3 w-3 h-4 bg-white/40 rounded-full blur-[1px]" />
                  <Heart className="w-5 h-5 fill-white/40 text-white" />
                </div>
                {/* Balloon Knot & String */}
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full -mt-0.5" />
                <div className="w-0.5 h-16 bg-white/30 rounded-full" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
