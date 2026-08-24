/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  initialSettings,
  defaultPhotos,
  defaultPinboardPhotos,
  defaultGalaxyPhotos,
  defaultScrapbookPages,
} from './data/defaultData';
import { AnniversarySettings, MemoryPhoto, ScrapbookPage } from './types';
import { Scene1Countdown } from './components/Scene1Countdown';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';

const Scene2Ribbon = lazy(() => import('./components/Scene2Ribbon').then(m => ({ default: m.Scene2Ribbon })));
const Scene3Pinboard = lazy(() => import('./components/Scene3Pinboard').then(m => ({ default: m.Scene3Pinboard })));
const Scene4Sketchbook = lazy(() => import('./components/Scene4Sketchbook').then(m => ({ default: m.Scene4Sketchbook })));
import { Scene5Galaxy } from './components/Scene5Galaxy';

export default function App() {
  const [settings, setSettings] = useState<AnniversarySettings>(initialSettings);
  const [photos, setPhotos] = useState<MemoryPhoto[]>(defaultPhotos);
  const [pinboardPhotos, setPinboardPhotos] = useState<MemoryPhoto[]>(defaultPinboardPhotos);
  const [galaxyPhotos, setGalaxyPhotos] = useState<MemoryPhoto[]>(defaultGalaxyPhotos);
  const [scrapbookPages] = useState<ScrapbookPage[]>(defaultScrapbookPages);

  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [canScroll, setCanScroll] = useState<boolean>(false);
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const numSections = 5;
  const isScrolling = useRef(false);

  useEffect(() => {
    if (!canScroll || selectedPhoto) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.overflow-y-auto')) return;

      e.preventDefault();
      if (isScrolling.current) return;

      if (e.deltaY > 0 && currentSectionIndex < numSections - 1) {
        isScrolling.current = true;
        setCurrentSectionIndex((prev) => prev + 1);
        setTimeout(() => (isScrolling.current = false), 1200);
      } else if (e.deltaY < 0 && currentSectionIndex > 0) {
        isScrolling.current = true;
        setCurrentSectionIndex((prev) => prev - 1);
        setTimeout(() => (isScrolling.current = false), 1200);
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.overflow-y-auto')) return;
      
      // Disable touch swipe for mobile width (768px or less) - users must use buttons
      const isMobile = window.innerWidth <= 768;
      if (isMobile) return; // Skip swipe logic on mobile, but don't prevent default
      
      startY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.overflow-y-auto')) return;
      if (target.closest('.cursor-grab')) return; // allow dragging polaroids

      // Disable touch swipe for mobile width (768px or less) - users must use buttons
      const isMobile = window.innerWidth <= 768;
      if (isMobile) return; // Skip swipe logic on mobile, but don't prevent default

      if (isScrolling.current) {
        e.preventDefault();
        return;
      }

      const deltaY = startY - e.touches[0].clientY;
      if (Math.abs(deltaY) > 40) {
        e.preventDefault();
        if (deltaY > 0 && currentSectionIndex < numSections - 1) {
          isScrolling.current = true;
          setCurrentSectionIndex((prev) => prev + 1);
          setTimeout(() => (isScrolling.current = false), 1200);
        } else if (deltaY < 0 && currentSectionIndex > 0) {
          isScrolling.current = true;
          setCurrentSectionIndex((prev) => prev - 1);
          setTimeout(() => (isScrolling.current = false), 1200);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canScroll, currentSectionIndex, selectedPhoto]);

  const goToSection = (index: number) => {
    if (index >= 0 && index < numSections) {
      setCurrentSectionIndex(index);
    }
  };

  return (
    <div className="relative h-screen w-full bg-slate-950 font-sans antialiased selection:bg-rose-500 selection:text-white overflow-hidden">
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => goToSection(currentSectionIndex - 1)}
          disabled={currentSectionIndex === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/85 text-white shadow-xl backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Go to previous section"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goToSection(currentSectionIndex + 1)}
          disabled={currentSectionIndex === numSections - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/85 text-white shadow-xl backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Go to next section"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Vertical Continuous Sections with Smooth Translation */}
      <motion.div
        className="flex flex-col w-full h-full"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        animate={{ y: `-${currentSectionIndex * 100}vh` }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Section 1: Ignite Years Countdown */}
        <section 
          id="scene-1" 
          className="h-screen w-full shrink-0 relative overflow-hidden"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        >
          <Scene1Countdown
            yearsCount={settings.yearsCount}
            partnerName={settings.partnerName}
            onCountdownComplete={() => setCanScroll(true)}
            active={currentSectionIndex <= 1}
          />
        </section>

        {/* Section 2: Happy Anniversary Ribbon & Quote */}
        <section
          id="scene-2"
          className="h-screen w-full shrink-0 relative overflow-hidden"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        >
          <Suspense fallback={<div className="w-full h-full bg-slate-950" />}>
            <Scene2Ribbon
              settings={settings}
              photos={photos}
              onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              onNextScene={() => goToSection(1)}
              active={currentSectionIndex <= 2}
            />
          </Suspense>
        </section>

        {/* Section 3: Draggable Memory Pinboard */}
        <section
          id="scene-3"
          className="h-screen w-full shrink-0 relative overflow-hidden"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        >
          <Suspense fallback={<div className="w-full h-full bg-slate-950" />}>
            <Scene3Pinboard
              settings={settings}
              photos={pinboardPhotos}
              onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              onNextScene={() => goToSection(3)}
              onAddPhoto={() => {}}
              active={currentSectionIndex >= 1 && currentSectionIndex <= 3}
            />
          </Suspense>
        </section>

        {/* Section 4: Interactive Sketchbook */}
        <section
          id="scene-4"
          className="h-screen w-full shrink-0 relative overflow-hidden"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        >
          <Suspense fallback={<div className="w-full h-full bg-slate-950" />}>
            <Scene4Sketchbook
              settings={settings}
              pages={scrapbookPages}
              onNextScene={() => goToSection(4)}
              active={currentSectionIndex >= 2 && currentSectionIndex <= 4}
            />
          </Suspense>
        </section>

        {/* Section 5: 3D Galaxy Memory Space */}
        <section
          id="scene-5"
          className="h-screen w-full shrink-0 relative overflow-hidden"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        >
          <Suspense fallback={<div className="w-full h-full bg-slate-950" />}>
            <Scene5Galaxy
              settings={settings}
              photos={galaxyPhotos}
              onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              onRestart={() => goToSection(0)}
              active={currentSectionIndex >= 3}
            />
          </Suspense>
        </section>
      </motion.div>

      {/* Lightbox Modal for Photo Details */}
      <PhotoLightboxModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
