import { handleArtistClick } from './utils';

export default function ArtistsList({
  groupedByArtist,
  searchQuery,
  isAuthenticated,
  playSong,
  navigate
}) {
  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        {searchQuery ? `Artists Found (${Object.keys(groupedByArtist).length})` : 'All Artists'}
      </h2>
      {Object.keys(groupedByArtist).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-base sm:text-lg mb-2">No artists found</p>
          <p className="text-xs sm:text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.values(groupedByArtist).map((artist, index) => (
            <div key={index} className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/80 transition-all duration-200">
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-700/50 cursor-pointer group"
                onClick={() => handleArtistClick(artist.artistId, artist.name, navigate)}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-black text-xl sm:text-2xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                  {artist.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{artist.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {artist.songs.length} song{artist.songs.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {artist.songs.slice(0, 3).map((song, songIndex) => (
                  <div key={song._id || songIndex} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-600/50 transition-colors touch-target">
                    <img
                      src={song.coverImageUrl || 'https://via.placeholder.com/50x50?text=No+Image'}
                      alt={song.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{song.title}</p>
                    </div>
                    <button
                      className={`w-8 h-8 ${isAuthenticated ? 'bg-transparent hover:bg-green-500/20 text-gray-400 hover:text-green-400' : 'bg-gray-600 cursor-not-allowed'} rounded-full flex items-center justify-center transition-all flex-shrink-0 touch-target`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAuthenticated) {
                          playSong(song, artist.songs, songIndex);
                        }
                      }}
                      disabled={!isAuthenticated}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
                      </svg>
                    </button>
                  </div>
                ))}
                {artist.songs.length > 3 && (
                  <button
                    className="col-span-full p-3 bg-transparent border border-gray-600 rounded-lg text-white text-sm font-semibold hover:border-white hover:bg-white/5 hover:scale-105 transition-all text-center touch-target"
                    onClick={() => handleArtistClick(artist.artistId, artist.name, navigate)}
                  >
                    View all {artist.songs.length} songs
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
