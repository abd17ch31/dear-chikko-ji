import React, { useMemo, memo } from 'react';
import { MemoryPhoto, AnniversarySettings } from '../types';
import StellarCardGallery from './ui/3d-image-gallery';
import { RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface Scene5GalaxyProps {
  settings: AnniversarySettings;
  photos: MemoryPhoto[];
  onSelectPhoto: (photo: MemoryPhoto) => void;
  onRestart: () => void;
}

export const Scene5Galaxy: React.FC<Scene5GalaxyProps & { active?: boolean }> = memo(({
  settings,
  photos,
  onSelectPhoto,
  onRestart,
  active = true,
}) => {
  const cards = useMemo(() => {
    // Randomize photos so all images from Flipbook folder appear on section 5 cards in random positions
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    return shuffled.map(photo => ({
      id: photo.id,
      imageUrl: photo.url,
      alt: photo.caption || 'Memory',
      title: photo.caption || 'Memory'
    }));
  }, [photos]);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden select-none">
      <StellarCardGallery 
        cards={cards} 
        onCardClick={(card) => {
          const photo = photos.find(p => p.id === card.id);
          if (photo) onSelectPhoto(photo);
        }} 
        active={active}
      />

      {/* Replay Button overlay */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => {
            soundFX.playClick();
            onRestart();
          }}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition backdrop-blur-md shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Story</span>
        </button>
      </div>
    </div>
  );
});
