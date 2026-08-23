import React, { useState } from 'react';
import { X, Heart, Plus, Sparkles, Check, Image as ImageIcon, Download } from 'lucide-react';
import { AnniversarySettings, MemoryPhoto } from '../types';

interface CustomizerModalProps {
  isOpen: boolean;
  settings: AnniversarySettings;
  photos: MemoryPhoto[];
  onClose: () => void;
  onSaveSettings: (newSettings: AnniversarySettings) => void;
  onAddPhoto: (photo: MemoryPhoto) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  settings,
  photos,
  onClose,
  onSaveSettings,
  onAddPhoto,
}) => {
  const [partnerName, setPartnerName] = useState(settings.partnerName);
  const [yearsCount, setYearsCount] = useState(settings.yearsCount);
  const [heroQuote, setHeroQuote] = useState(settings.heroQuote);

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoTag, setNewPhotoTag] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      partnerName,
      yearsCount: Number(yearsCount) || 1,
      heroQuote,
    });
    onClose();
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !newPhotoCaption.trim()) return;

    onAddPhoto({
      id: `custom-photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim(),
      tag: newPhotoTag.trim() || newPhotoCaption.trim(),
      date: 'Special Moment',
    });

    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoTag('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-serif font-bold text-amber-200">
              Customize Anniversary Website
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Source Code Quick Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-200">Download Source Code</p>
              <p className="text-xs text-slate-400">Get the complete project ZIP archive with all assets & code</p>
            </div>
          </div>
          <a
            href="/project-source.zip"
            download="project-source.zip"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ZIP</span>
          </a>
        </div>

        {/* General Settings Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Partner's Name
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                placeholder="e.g. Sweety, My Love"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Years Together
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={yearsCount}
                onChange={(e) => setYearsCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Hero Anniversary Quote
            </label>
            <textarea
              rows={2}
              value={heroQuote}
              onChange={(e) => setHeroQuote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500 resize-none"
              placeholder="Enter romantic dedication quote..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-full transition shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Anniversary Settings</span>
            </button>
          </div>
        </form>

        {/* Add Custom Photo Section */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" /> Add Custom Photo Memory
          </h4>

          <form onSubmit={handleCreatePhoto} className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                placeholder="Caption (e.g. Sunset Kiss)"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                value={newPhotoTag}
                onChange={(e) => setNewPhotoTag(e.target.value)}
                placeholder="Polaroid Tag (e.g. Cutie 🎀)"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!newPhotoUrl.trim() || !newPhotoCaption.trim()}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Memory Photo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
