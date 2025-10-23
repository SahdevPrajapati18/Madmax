import { Link } from 'react-router-dom';
import { handlePlayPlaylist } from './utils';

export default function UserPlaylists({
  playlists,
  playlistLoading,
  isAuthenticated,
  playSong,
  playlistService
}) {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Your Playlists</h2>
        <Link
          to="/playlists/create"
          className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full font-semibold transition-colors text-sm touch-target flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playlist
        </Link>
      </div>

      {playlistLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg mb-2">No playlists yet</p>
          <p className="text-sm mb-4">Create your first playlist to organize your music</p>
          <Link
            to="/playlists/create"
            className="px-6 py-3 bg-green-500 text-black rounded-full hover:bg-green-400 transition-colors font-semibold touch-target"
          >
            Create Your First Playlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.slice(0, 10).map((playlist) => (
            <Link
              key={playlist._id || playlist.id}
              to={`/playlists/${playlist._id || playlist.id}`}
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
