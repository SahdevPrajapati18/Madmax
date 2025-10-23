export default function PlayPauseButton({ isPlaying, onTogglePlay, size = "regular" }) {
  const isFullscreen = size === "fullscreen";
  const buttonBase = "bg-white text-black rounded-full flex items-center justify-center transition-all shadow-lg touch-target";
  const iconSize = isFullscreen ? 22 : 18;

  return (
    <button
      onClick={onTogglePlay}
      className={`${buttonBase} ${
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
  );
}
