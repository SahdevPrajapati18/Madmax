import React from "react";

export default function AudioControls({
  onPrevious,
  onNext,
  onTogglePlay,
  onToggleLoop,
  isPlaying,
  isLoop,
  size = "regular", // 'fullscreen' or 'regular'
}) {
  const isFullscreen = size === "fullscreen";

  const buttonBase =
    "rounded-full flex items-center justify-center transition-all touch-target";
  const iconSize = isFullscreen ? 22 : 18;

  return (
    <div
      className={`flex items-center justify-center ${
        isFullscreen ? "gap-6" : "gap-2 sm:gap-4 lg:gap-6"
      }`}
    >
      {/* Loop Button */}
      <button
        onClick={onToggleLoop}
        className={`${buttonBase} ${
          isLoop
            ? "text-green-500 bg-green-500/20 hover:text-green-400"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        } ${isFullscreen ? "p-3" : "p-2 sm:p-3 md:p-4"}`}
        title={isLoop ? "Loop On" : "Loop Off"}
      >
        <svg
          width={iconSize - 4}
          height={iconSize - 4}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 4a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16zm-1 9V8l-4 4 4 4v-3h8v-2h-8z" />
        </svg>
      </button>

      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!onPrevious}
        className={`${buttonBase} ${
          onPrevious
            ? "text-gray-400 hover:text-white hover:bg-gray-700"
            : "text-gray-600 cursor-not-allowed"
        } ${isFullscreen ? "p-3" : "p-2 sm:p-3 md:p-4"}`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
        </svg>
      </button>

      {/* Play/Pause Button (Main) */}
      <button
        onClick={onTogglePlay}
        className={`bg-white text-black ${buttonBase} shadow-lg ${
          isFullscreen
            ? "p-5 w-16 h-16 md:w-20 md:h-20 hover:scale-110"
            : "p-3 sm:p-4 md:p-5 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:scale-105"
        }`}
      >
        {isPlaying ? (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
          </svg>
        ) : (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
          </svg>
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!onNext}
        className={`${buttonBase} ${
          onNext
            ? "text-gray-400 hover:text-white hover:bg-gray-700"
            : "text-gray-600 cursor-not-allowed"
        } ${isFullscreen ? "p-3" : "p-2 sm:p-3 md:p-4"}`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
        </svg>
      </button>
    </div>
  );
}
