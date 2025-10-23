export default function LoopButton({ isLoop, onToggleLoop, size = "regular" }) {
  const isFullscreen = size === "fullscreen";
  const buttonBase = "rounded-full flex items-center justify-center transition-all touch-target";
  const iconSize = isFullscreen ? 18 : 14;

  return (
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
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 4a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16zm-1 9V8l-4 4 4 4v-3h8v-2h-8z" />
      </svg>
    </button>
  );
}
