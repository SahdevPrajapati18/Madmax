export default function NavigationButton({ onClick, disabled, direction, size = "regular" }) {
  const isFullscreen = size === "fullscreen";
  const buttonBase = "rounded-full flex items-center justify-center transition-all touch-target";
  const iconSize = isFullscreen ? 22 : 18;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonBase} ${
        disabled
          ? "text-gray-600 cursor-not-allowed"
          : "text-gray-400 hover:text-white hover:bg-gray-700"
      } ${isFullscreen ? "p-3" : "p-2 sm:p-3 md:p-4"}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        {direction === 'previous' ? (
          <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
        ) : (
          <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
        )}
      </svg>
    </button>
  );
}
