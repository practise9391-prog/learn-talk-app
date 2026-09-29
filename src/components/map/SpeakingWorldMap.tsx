import React, { useState } from 'react';
import { SPEAKING_WORLD_LOCATIONS } from '../../data/locations';
import { LocationScenario } from '../../types';
import { LocationPin } from './LocationPin';
import { LocationDetailModal } from './LocationDetailModal';
import { FilterBar } from '../common/FilterBar';
import { SearchBar } from '../common/SearchBar';
import { Compass, MapPin, Sparkles, Layers } from 'lucide-react';

export const SpeakingWorldMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationScenario | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');

  const categories = [
    { id: 'all', label: 'All Environments', count: SPEAKING_WORLD_LOCATIONS.length, icon: '🌎' },
    { id: 'daily_life', label: 'Daily Life', count: 6, icon: '☕' },
    { id: 'work_study', label: 'Work & Study', count: 5, icon: '🏢' },
    { id: 'travel_transit', label: 'Travel & Transit', count: 5, icon: '✈️' },
    { id: 'social_community', label: 'Social & Community', count: 4, icon: '🎬' },
  ];

  const filteredLocations = SPEAKING_WORLD_LOCATIONS.filter((loc) => {
    const matchesCategory = activeCategory === 'all' || loc.category === activeCategory;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Top Filter & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterBar
          options={categories}
          selectedId={activeCategory}
          onSelect={setActiveCategory}
          className="flex-1"
        />

        <div className="flex items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search locations (e.g. Tea Shop)..."
            className="w-full sm:w-64"
          />

          <div className="flex items-center bg-card p-1 rounded-xl border border-border shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text'
              }`}
            >
              World Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
      </div>

      {/* View Mode 1: Illustrated Visual Map */}
      {viewMode === 'map' && (
        <div className="relative w-full rounded-3xl overflow-hidden border border-border bg-slate-900 shadow-xl min-h-[460px] sm:min-h-[560px] select-none">
          {/* Illustrated Terrain Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-indigo-950/70 to-slate-900 pointer-events-none">
            {/* SVG Terrain Contours & Highways */}
            <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
                <radialGradient id="worldAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="50%" cy="50%" r="40%" fill="url(#worldAura)" />
              {/* Illustrated Roads / Flow Lines connecting locations */}
              <path
                d="M 120 180 Q 220 280, 400 240 T 700 320"
                fill="none"
                stroke="rgba(99, 102, 241, 0.35)"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              <path
                d="M 220 350 Q 380 480, 620 520 T 820 800"
                fill="none"
                stroke="rgba(14, 165, 233, 0.35)"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {/* Interactive World Pins */}
          <div className="relative w-full h-full min-h-[460px] sm:min-h-[560px] p-6">
            {filteredLocations.map((loc) => (
              <LocationPin
                key={loc.id}
                location={loc}
                isSelected={selectedLocation?.id === loc.id}
                onClick={() => setSelectedLocation(loc)}
              />
            ))}
          </div>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white max-w-xs shadow-lg pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <Compass size={16} className="text-primary animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-black uppercase tracking-wider">
                LearnTalk Speaking World
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Tap any pin to enter real-life spoken scenarios. The AI adapts with context locking.
            </p>
          </div>
        </div>
      )}

      {/* View Mode 2: Responsive Location Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                    {loc.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted capitalize">
                    {loc.category.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  {loc.name}
                </h3>
                <p className="text-xs font-semibold text-primary/90 mt-0.5">
                  {loc.tagline}
                </p>
                <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                  {loc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
                <span>Explore Scenario</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Location Modal */}
      <LocationDetailModal
        location={selectedLocation}
        isOpen={Boolean(selectedLocation)}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
};
