import React, { useState } from 'react';
import { SPEAKING_WORLD_LOCATIONS } from '../../data/locations';
import { LocationDetailModal } from '../map/LocationDetailModal';
import { LocationScenario } from '../../types';
import { useNavigation } from '../../context/NavigationContext';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

export const SpeakingWorldPreview: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState<LocationScenario | null>(null);

  // Spotlight 6 key locations
  const spotlightLocations = SPEAKING_WORLD_LOCATIONS.filter((l) =>
    ['tea-shop', 'home', 'restaurant', 'office', 'hotel', 'airport'].includes(l.id)
  );

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            <h2 className="text-lg sm:text-xl font-black text-text tracking-tight">
              Speaking World Environments
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Step into 20+ realistic daily situations. The AI locks into the role and scenario!
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/talk')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
        >
          <span>Explore All 20+ Locations</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Grid of spotlight locations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {spotlightLocations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => setSelectedLocation(loc)}
            className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-card border border-border/80 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform shadow-xs">
              {loc.icon}
            </div>
            <span className="text-xs font-black text-text group-hover:text-primary transition-colors">
              {loc.name}
            </span>
            <span className="text-[10px] text-text-muted font-medium mt-0.5 truncate w-full">
              {loc.tagline}
            </span>
          </div>
        ))}
      </div>

      {/* Modal for location details */}
      <LocationDetailModal
        location={selectedLocation}
        isOpen={Boolean(selectedLocation)}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
};
