import React from 'react';

export default function VolumeControls({
  volume,
  isMuted,
  onVolumeChange,
  onMuteClick
}) {
  const volumePercentage = isMuted ? 0 : volume * 100;

  return (
    <div className="volume-controls hidden md:flex items-center gap-2 lg:gap-3 min-w-[120px] lg:min-w-[140px]">
      <button
        className="text-gray-400 hover:text-white p-1.5 rounded-full transition-colors hover:bg-gray-700 active:scale-95"
        onClick={onMuteClick}
        title={isMuted ? 'Unmute' : 'Mute'}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? (
          <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"/>
            <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"/>
          </svg>
        ) : volume < 0.5 ? (
          <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"/>
          </svg>
        )}
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={volumePercentage}
        onChange={onVolumeChange}
        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-webkit-slider-thumb]:transition-transform
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:rounded-full"
        aria-label="Volume"
      />
    </div>
  );
}