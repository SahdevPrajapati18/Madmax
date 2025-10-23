export default function TrackInfo({ currentSong, size = "regular" }) {
  const isFullscreen = size === "fullscreen";

  return (
    <div className={`flex items-center gap-4 ${isFullscreen ? 'mb-8' : 'mb-4'}`}>
      {/* Cover Image */}
      <div className={`relative flex-shrink-0 ${isFullscreen ? 'w-16 h-16' : 'w-12 h-12 sm:w-14 sm:h-14'} rounded-lg overflow-hidden`}>
        <img
          src={currentSong?.coverImageUrl || 'https://via.placeholder.com/150x150?text=No+Image'}
          alt={currentSong?.title || 'Unknown Track'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Track Details */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-white truncate ${
          isFullscreen ? 'text-lg' : 'text-sm sm:text-base'
        }`}>
          {currentSong?.title || 'Unknown Title'}
        </h3>
        <p className={`text-gray-400 truncate ${
          isFullscreen ? 'text-base' : 'text-xs sm:text-sm'
        }`}>
          {currentSong?.artist || 'Unknown Artist'}
        </p>
        {isFullscreen && currentSong?.album && (
          <p className="text-sm text-gray-500 truncate">
            {currentSong.album}
          </p>
        )}
      </div>
    </div>
  );
}
