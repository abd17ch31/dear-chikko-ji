import React from 'react';
import { X, Heart, Calendar, Tag } from 'lucide-react';
import { MemoryPhoto } from '../types';

interface PhotoLightboxModalProps {
  photo: MemoryPhoto | null;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Container */}
        <div className="w-full h-80 sm:h-96 overflow-hidden bg-stone-100 relative">
          <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-3 py-1 bg-rose-500 text-white text-xs font-semibold rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow">
              <Tag className="w-3 h-3" /> {photo.tag || photo.caption}
            </span>
            <h3 className="text-2xl font-serif font-bold mt-2">{photo.caption}</h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center text-xs text-slate-500 space-x-4 border-b border-stone-100 pb-3">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-rose-500" /> {photo.date || 'Anniversary Memory'}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Captured Love
            </span>
          </div>

          <p className="text-sm text-slate-600 font-serif italic leading-relaxed">
            "Every single moment spent together becomes a priceless treasure in our story. Here's to forever with you."
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-full transition cursor-pointer"
            >
              Close Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
