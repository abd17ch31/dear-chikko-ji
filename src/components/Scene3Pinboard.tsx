import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MemoryPhoto, AnniversarySettings } from '../types';
import { Sparkles, Move, Heart, Plus, ChevronRight } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface Scene3PinboardProps {
  settings: AnniversarySettings;
  photos: MemoryPhoto[];
  onSelectPhoto: (photo: MemoryPhoto) => void;
  onNextScene: () => void;
  onAddPhoto: () => void;
}

export const Scene3Pinboard: React.FC<Scene3PinboardProps & { active?: boolean }> = ({
  settings,
  photos,
  onSelectPhoto,
  onNextScene,
  onAddPhoto,
  active = true,
}) => {
  const [activeZIndex, setActiveZIndex] = useState<Record<string, number>>({});
  const [highestZ, setHighestZ] = useState<number>(10);

  // Position coordinates spread across canvas
  const defaultPositions = [
    { x: -280, y: -120, rotate: -6 },
    { x: -90, y: -160, rotate: 4 },
    { x: 100, y: -140, rotate: -3 },
    { x: 280, y: -110, rotate: 7 },
    { x: -220, y: 100, rotate: 5 },
    { x: -20, y: 120, rotate: -8 },
    { x: 180, y: 110, rotate: 3 },
    { x: 320, y: 90, rotate: -5 },
    { x: 0, y: -20, rotate: 2 },
  ];

  const handleBringToFront = (id: string) => {
    soundFX.playClick();
    setHighestZ((prev) => prev + 1);
    setActiveZIndex((prev) => ({ ...prev, [id]: highestZ + 1 }));
  };

  return (
    <div className="relative h-full w-full bg-[#2a4d3a] text-slate-200 flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Draggable Polaroid Stage */}
      <div className="relative flex-1 w-full flex items-center justify-center my-6 min-h-[500px]">
        {photos.map((photo, index) => {
          const pos = defaultPositions[index % defaultPositions.length];
          const z = activeZIndex[photo.id] || index + 1;

          return (
            <motion.div
              key={photo.id}
              drag
              dragConstraints={{ left: -400, right: 400, top: -250, bottom: 250 }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={() => handleBringToFront(photo.id)}
              onClick={() => handleBringToFront(photo.id)}
              initial={{ x: pos.x, y: pos.y, rotate: pos.rotate, scale: 0.8, opacity: 0 }}
              animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              style={{ zIndex: z, position: 'absolute' }}
              className={`cursor-grab active:cursor-grabbing group touch-none ${active ? '' : 'pointer-events-none'}`}
            >
              {/* Polaroid Frame */}
              <div className="w-40 sm:w-44 p-2.5 pb-3.5 bg-white rounded-sm shadow-xl border border-stone-200/80 transition-shadow duration-300 hover:shadow-2xl hover:scale-105 relative">
                {/* Cute Heart Washi Tape at Top */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-rose-200/80 backdrop-blur-sm border border-rose-300/60 rotate-[-2deg] flex items-center justify-center shadow-xs rounded-xs">
                  <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                </div>

                {/* Photo Image Container */}
                <div className="w-full h-36 sm:h-40 overflow-hidden bg-stone-100 rounded-xs mb-2 border border-stone-200 relative">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-xs text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Move className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Handwritten Tag Caption */}
                <div className="flex items-center justify-between px-1">
                  <p className="font-serif italic text-xs sm:text-sm text-slate-800 font-semibold truncate">
                    {photo.tag || photo.caption}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPhoto(photo);
                    }}
                    className="text-[10px] text-rose-600 hover:text-rose-800 underline font-sans font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Instructions */}
      <div className="relative z-20 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/20">
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Rearrange memory cards as you wish
        </span>
        <span>{photos.length} Captured Memories</span>
      </div>
    </div>
  );
};
