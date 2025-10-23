import { Link } from 'react-router-dom';
import { handlePlayPlaylist } from './utils';

export default function PublicPlaylists({
  publicPlaylists,
  playlistLoading,
  playSong,
  playlistService
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Discover Playlists</h2>
        <Link
          to="/playlists"
          className="text-green-500 hover:text-green-400 font-semibold transition-colors text-sm touch-target"
        >
          View All
        </Link>
      </div>

      {playlistLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      ) : publicPlaylists.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-base">No public playlists available</p>
          <p className="text-sm">Be the first to share your music with the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {publicPlaylists.slice(0, 10).map((playlist) => (
            <div
              key={playlist._id || playlist.id}
              className="group bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/80 transition-all duration-200 touch-target"
            >
              <div className="relative mb-3 aspect-square">
                {playlist.coverImageUrl ? (
                  <img
                    src={playlist.coverImageUrl}
                    alt={playlist.title}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-md flex items-center justify-center text-lg font-bold text-gray-400 ${playlist.coverImageUrl ? 'hidden' : ''}`}>
                  {playlist.title?.charAt(0).toUpperCase()}
                </div>

                {/* Play button overlay */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePlayPlaylist(playlist, playSong, playlistService);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md touch-target"
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-semibold text-sm truncate leading-tight">{playlist.title}</h3>
                <p className="text-gray-400 text-xs">
                  {playlist.trackCount || playlist.musics?.length || 0} tracks
                </p>
                {playlist.plays && (
                  <p className="text-gray-500 text-xs">
                    {playlist.plays} plays
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
