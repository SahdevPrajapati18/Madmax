import { handleArtistClick } from './utils';

export default function SongsGrid({
  songs,
  searchQuery,
  isAuthenticated,
  playSong,
  navigate
}) {
  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        {searchQuery ? `Search Results (${songs.length})` : 'All Songs'}
      </h2>
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-base sm:text-lg">No songs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {songs.map((song, index) => (
            <div
              key={song._id || song.id || index}
              className="group bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-gray-700/80 transition-all duration-200 cursor-pointer touch-target"
            >
              <div className="relative mb-3 aspect-square">
                <img
                  src={song.coverImageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={song.title || 'Unknown Title'}
                  className="w-full h-full object-cover rounded-md shadow-lg"
                />
                {isAuthenticated && (
                  <button
                    className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg touch-target"
                    onClick={() => playSong(song, songs, index)}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </button>
                )}
                {!isAuthenticated && (
                  <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-semibold text-xs sm:text-sm truncate leading-tight">{song.title || 'Unknown Title'}</h3>
                <button
                  className="text-gray-400 text-xs sm:text-sm hover:text-white hover:underline transition-colors text-left touch-target"
                  onClick={() => handleArtistClick(song.artistId, song.artist, navigate)}
                >
                  {song.artist || 'Unknown Artist'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
