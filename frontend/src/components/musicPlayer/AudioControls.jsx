import React from "react";
import LoopButton from './LoopButton';
import PlayPauseButton from './PlayPauseButton';
import NavigationButton from './NavigationButton';

export default function AudioControls({
  onPrevious,
  onNext,
  onTogglePlay,
  onToggleLoop,
  isPlaying,
  isLoop,
  size = "regular", // 'fullscreen' or 'regular'
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        size === "fullscreen" ? "gap-6" : "gap-2 sm:gap-4 lg:gap-6"
      }`}
    >
      {/* Loop Button */}
      <LoopButton
        isLoop={isLoop}
        onToggleLoop={onToggleLoop}
        size={size}
      />

      {/* Previous Button */}
      <NavigationButton
        onClick={onPrevious}
        disabled={!onPrevious}
        direction="previous"
        size={size}
      />

      {/* Play/Pause Button (Main) */}
      <PlayPauseButton
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        size={size}
      />

      {/* Next Button */}
      <NavigationButton
        onClick={onNext}
        disabled={!onNext}
        direction="next"
        size={size}
      />
    </div>
  );
}
