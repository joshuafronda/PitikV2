import React from 'react';
import { FILTERS, FRAMES, FilterOption, FrameOption } from '../types';
import { Check, Palette, Wand2 } from 'lucide-react';

interface FilterFrameSelectorProps {
  currentFilter?: FilterOption;
  currentFrame?: FrameOption;
  onFilterChange?: (filter: FilterOption) => void;
  onFrameChange?: (frame: FrameOption) => void;
  mode: 'filter' | 'frame';
  setMode?: (mode: 'filter' | 'frame') => void;
  hideTabs?: boolean;
}

export const FilterFrameSelector: React.FC<FilterFrameSelectorProps> = ({
  currentFilter,
  currentFrame,
  onFilterChange,
  onFrameChange,
  mode,
  setMode,
  hideTabs = false,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-3 md:p-4 border border-stone-200 w-full">
      {/* Tabs - Only show if not hidden */}
      {!hideTabs && setMode && (
        <div className="flex space-x-2 mb-4 p-1 bg-stone-100 rounded-full">
          <button
            onClick={() => setMode('filter')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium transition-all ${
              mode === 'filter' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={() => setMode('frame')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium transition-all ${
              mode === 'frame' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Palette className="w-4 h-4 mr-2" />
            Frames
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 md:grid-cols-3 gap-2 md:gap-3">
        {mode === 'filter' && onFilterChange && currentFilter
          ? FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter)}
                className={`relative group overflow-hidden rounded-lg aspect-square border-2 transition-all ${
                  currentFilter.id === filter.id ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-2' : 'border-transparent hover:border-stone-300'
                }`}
              >
                {/* Preview simulation */}
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: 'url("https://picsum.photos/200/200?grayscale")', 
                    filter: filter.css 
                  }} 
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-0.5 md:p-1">
                  <span className="text-[10px] md:text-xs text-white font-medium truncate w-full text-center">{filter.name}</span>
                </div>
                {currentFilter.id === filter.id && (
                  <div className="absolute top-1 right-1 bg-stone-900 text-white rounded-full p-0.5">
                    <Check className="w-2 h-2 md:w-3 md:h-3" />
                  </div>
                )}
              </button>
            ))
          : mode === 'frame' && onFrameChange && currentFrame
          ? FRAMES.map((frame) => (
              <button
                key={frame.id}
                onClick={() => onFrameChange(frame)}
                className={`relative rounded-lg aspect-square border-2 transition-all flex items-center justify-center ${
                  currentFrame.id === frame.id ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-2' : 'border-stone-200 hover:border-stone-300'
                }`}
                style={{ backgroundColor: frame.bgColor }}
              >
                <div className="text-center p-0.5 md:p-1">
                  <span className={`text-[10px] md:text-xs font-medium block leading-tight truncate`} style={{ color: frame.textColor }}>
                    {frame.name}
                  </span>
                </div>
                 {currentFrame.id === frame.id && (
                  <div className="absolute top-1 right-1 bg-stone-900 text-white rounded-full p-0.5">
                    <Check className="w-2 h-2 md:w-3 md:h-3" />
                  </div>
                )}
              </button>
            ))
          : null}
      </div>
    </div>
  );
};