import { Link } from 'react-router-dom';
import playlistService from '../../services/playlistService';

export default function PlaylistList({ playlists, loading, handlePlayPlaylist }) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">My Playlists</h2>
        <div className="flex gap-2">
          <Link
            to="/playlists"
            className="text-green-500 hover:text-green-400 text-sm font-semibold transition-colors touch-target"
          >
            View All
          </Link>
          <Link
            to="/playlists/create"
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors touch-target"
            title="Create new playlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-base mb-2">No playlists yet</p>
            <p className="text-sm">Create your first playlist</p>
            <Link
              to="/playlists/create"
              className="mt-3 inline-block px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors font-semibold text-sm touch-target"
            >
              Create Playlist
            </Link>
          </div>
        ) : (
          playlists.slice(0, 4).map((playlist) => (
            <div key={playlist.id} className="group cursor-pointer">
              <Link to={`/playlists/${playlist._id || playlist.id}`} className="block">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors touch-target">
                  <div className="relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                    {playlist.coverImageUrl ? (
                      <img
                        src={playlist.coverImageUrl}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg sm:text-2xl group-hover:scale-105 transition-transform ${playlist.coverImageUrl ? 'hidden' : ''}`}>
                      {playlist.title?.charAt(0).toUpperCase()}
                    </div>

                    {/* Play button overlay */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlayPlaylist(playlist);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg touch-target"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{playlist.title}</h3>
                      {playlist.isPublic && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full flex-shrink-0">
                          Public
                        </span>
                      )}
                    </div>
                    {playlist.description && (
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">{playlist.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{playlist.trackCount || playlist.musics?.length || 0} tracks</span>
                      {playlist.duration && (
                        <>
                          <span>•</span>
                          <span>{Math.floor(playlist.duration / 60)}:{(playlist.duration % 60).toString().padStart(2, '0')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
