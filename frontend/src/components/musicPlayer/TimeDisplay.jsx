import { formatTime } from './utils';

export default function TimeDisplay({ currentTime, duration, size = "regular" }) {
  const isFullscreen = size === "fullscreen";

  return (
    <div className={`flex items-center gap-2 text-gray-400 ${
      isFullscreen ? 'text-base' : 'text-xs sm:text-sm'
    }`}>
      <span>{formatTime(currentTime)}</span>
      <span>/</span>
      <span>{formatTime(duration)}</span>
    </div>
  );
}
