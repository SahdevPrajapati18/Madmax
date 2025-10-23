import React from 'react';

export default function ProgressBar({
  currentTime,
  duration,
  progressPercentage,
  onSeek,
  formatTime,
  size = 'regular'
}) {
  const isFullscreen = size === 'fullscreen';

  const containerClasses = isFullscreen
    ? 'w-full px-4 sm:px-8 md:px-0 md:max-w-2xl mx-auto'
    : 'w-full px-2 sm:px-0';

  const timeClasses = isFullscreen
    ? 'text-gray-300 text-xs sm:text-sm md:text-base font-medium'
    : 'text-gray-400 text-[10px] sm:text-xs';

  const sliderHeight = isFullscreen ? 'h-1.5 sm:h-2 md:h-2.5' : 'h-1 sm:h-1.5';

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Current Time */}
        <span className={`${timeClasses} min-w-[32px] sm:min-w-[40px] text-right tabular-nums`}>
          {formatTime(currentTime)}
        </span>

        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercentage}
          onChange={onSeek}
          className={`
            flex-1 appearance-none rounded-full cursor-pointer bg-gray-700/50
            ${sliderHeight}
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:sm:w-3.5 [&::-webkit-slider-thumb]:sm:h-3.5
            [&::-webkit-slider-thumb]:md:w-4 [&::-webkit-slider-thumb]:md:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-100
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:sm:w-3.5 [&::-moz-range-thumb]:sm:h-3.5
            [&::-moz-range-thumb]:md:w-4 [&::-moz-range-thumb]:md:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:shadow-md
            focus:outline-none focus:ring-2 focus:ring-white/20
          `}
          style={{
            background: `linear-gradient(to right, #fff ${progressPercentage}%, rgba(107, 114, 128, 0.5) ${progressPercentage}%)`
          }}
        />

        {/* Duration */}
        <span className={`${timeClasses} min-w-[32px] sm:min-w-[40px] text-left tabular-nums`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}