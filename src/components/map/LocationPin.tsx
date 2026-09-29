import React from 'react';
import { LocationScenario } from '../../types';

interface LocationPinProps {
  location: LocationScenario;
  isSelected?: boolean;
  onClick: () => void;
}

export const LocationPin: React.FC<LocationPinProps> = ({
  location,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        left: `${location.coordinates.x}%`,
        top: `${location.coordinates.y}%`,
      }}
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 transition-all duration-200
        focus:outline-none focus:scale-110
      `}
      title={`${location.name}: ${location.tagline}`}
    >
      {/* Visual Marker */}
      <div
        className={`
          relative flex items-center justify-center rounded-2xl p-2.5 transition-all duration-300
          ${
            isSelected
              ? 'bg-primary text-white scale-125 shadow-xl shadow-primary/40 ring-4 ring-primary/30 z-20'
              : 'bg-surface/90 text-text border border-border shadow-md hover:scale-115 hover:border-primary/50 hover:shadow-lg'
          }
        `}
      >
        <span className="text-xl sm:text-2xl select-none group-hover:scale-110 transition-transform">
          {location.icon}
        </span>
        {isSelected && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}
      </div>

      {/* Label Badge */}
      <div
        className={`
          mt-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap backdrop-blur-md shadow-xs transition-colors
          ${
            isSelected
              ? 'bg-primary text-primary-foreground font-black'
              : 'bg-surface/90 text-text border border-border/80 group-hover:bg-card'
          }
        `}
      >
        {location.name}
      </div>
    </button>
  );
};
