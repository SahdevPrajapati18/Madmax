import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import playlistService from '../services/playlistService';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');
  const { playSong } = useAuth();

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPlaylists(), fetchPublicPlaylists()]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  const handlePlayPlaylist = async (playlist) => {
    try {
      // If playlist has musics, play the first song
      if (playlist.musics && playlist.musics.length > 0) {
        // For now, we'll play the first song in the playlist
        // In a real implementation, you might want to fetch the full playlist data first
        const firstSong = playlist.musics[0];
        if (firstSong && firstSong.musicUrl) {
          playSong(firstSong, playlist.musics, 0);
        } else {
          // If the playlist data doesn't have full music objects, fetch the playlist details first
          const playlistDetails = await playlistService.getPlaylistById(playlist._id || playlist.id);
          if (playlistDetails.playlist && playlistDetails.playlist.musics && playlistDetails.playlist.musics.length > 0) {
            playSong(playlistDetails.playlist.musics[0], playlistDetails.playlist.musics, 0);
          }
        }
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await playlistService.getPlaylists();
      setPlaylists(response.playlists || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchPublicPlaylists = async () => {
    try {
      const response = await playlistService.getPublicPlaylists();
      setPublicPlaylists(response.playlists || []);
    } catch (error) {
      console.error('Error fetching public playlists:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await playlistService.deletePlaylist(playlistId);
        setPlaylists(playlists.filter(p => p._id !== playlistId));
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Error deleting playlist');
      }
    }
  };

  const currentPlaylists = activeTab === 'my' ? playlists : publicPlaylists;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center pb-24">
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">My Playlists</h1>
              <p className="text-gray-400 text-lg">Create and manage your music collections</p>
            </div>
            <Link
              to="/playlists/create"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-lg touch-target"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Playlist
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-gray-700/50">
            <button
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all touch-target ${
                activeTab === 'my'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('my')}
            >
              My Playlists ({playlists.length})
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all touch-target ${
                activeTab === 'public'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('public')}
            >
              Public Playlists ({publicPlaylists.length})
            </button>
          </div>
        </div>

        {/* Playlists Grid */}
        {currentPlaylists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl mb-2">
              {activeTab === 'my' ? 'No playlists yet' : 'No public playlists available'}
            </p>
            <p className="text-sm mb-6 text-center max-w-md">
              {activeTab === 'my'
                ? 'Create your first playlist to organize your favorite music'
                : 'Be the first to share your music with the community'
              }
            </p>
            {activeTab === 'my' && (
              <Link
                to="/playlists/create"
                className="px-6 py-3 bg-green-500 text-black rounded-xl hover:bg-green-400 transition-colors font-semibold touch-target"
              >
                Create Your First Playlist
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPlaylists.map((playlist) => (
              <div key={playlist._id || playlist.id} className="group bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:bg-gray-700/80 transition-all duration-200">
                {/* Playlist Cover */}
                <div className="relative mb-4 aspect-square">
                  {playlist.coverImageUrl ? (
                    <img
                      src={playlist.coverImageUrl}
                      alt={playlist.title}
                      className="w-full h-full rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/400/400?random=${playlist._id || playlist.id}`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-4xl font-bold text-gray-400">
                      {playlist.title?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Play button overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePlayPlaylist(playlist);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg touch-target"
                  >
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>

                  {/* Duration badge */}
                  {playlist.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {playlistService.formatDuration(playlist.duration)}
                    </div>
                  )}
                </div>

                {/* Playlist Info */}
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-lg truncate">{playlist.title}</h3>
                  {playlist.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{playlistService.formatTrackCount(playlist.trackCount || playlist.musics?.length || 0)}</span>
                    {playlist.plays && (
                      <span>{playlist.plays} plays</span>
                    )}
                  </div>

                  {playlist.tags && playlist.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {playlist.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    to={`/playlists/${playlist._id || playlist.id}`}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-center touch-target"
                  >
                    View
                  </Link>
                  {activeTab === 'my' && (
                    <>
                      <button
                        onClick={() => handleDeletePlaylist(playlist._id || playlist.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors touch-target"
                        title="Delete playlist"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
