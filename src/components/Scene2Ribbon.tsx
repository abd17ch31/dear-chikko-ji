import React from 'react';
import { motion } from 'motion/react';
import { MemoryPhoto, AnniversarySettings } from '../types';
import MarqueeAlongSvgPath from './ui/marquee-along-svg-path';

interface Scene2RibbonProps {
  settings: AnniversarySettings;
  photos: MemoryPhoto[];
  onSelectPhoto: (photo: MemoryPhoto) => void;
  onNextScene: () => void;
}

const path =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5"

export const Scene2Ribbon: React.FC<Scene2RibbonProps & { active?: boolean }> = ({
  settings,
  photos,
  onSelectPhoto,
  onNextScene,
  active = true,
}) => {
  return (
    <div className="relative h-full w-full bg-zinc-50 overflow-hidden flex items-center justify-center">
      
      {/* Background Marquee */}
      <div className="absolute inset-0 z-0">
        <MarqueeAlongSvgPath
          path={path}
          viewBox="0 0 996 330"
          width="990px"
          height="200px"
          baseVelocity={8}
          slowdownOnHover={true}
          draggable={true}
          repeat={2}
          dragSensitivity={0.1}
          className="w-full h-full scale-[1.47] sm:scale-105"
          responsive
          grabCursor
          active={active}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              className="w-24 sm:w-32 h-32 sm:h-44 hover:scale-110 transition-transform duration-300 ease-out cursor-pointer shadow-md rounded overflow-hidden border border-slate-200 bg-white p-1 will-change-transform"
              onClick={() => onSelectPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover rounded-sm"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </MarqueeAlongSvgPath>
      </div>

      {/* Foreground Overlay Title */}
      <div className="absolute top-8 sm:top-16 left-8 sm:left-16 z-10 pointer-events-none max-w-xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight drop-shadow-md">
            Happy Anniversary <br />
            <span className="text-amber-600 font-serif italic drop-shadow-sm">
              {settings.partnerName}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Quote at the bottom */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-center z-10 pointer-events-none px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-lg sm:text-2xl text-slate-800 font-serif italic text-center max-w-3xl drop-shadow-sm">
            "{settings.heroQuote}"
          </p>
        </motion.div>
      </div>
    </div>
  );
};
