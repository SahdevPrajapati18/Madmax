import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import playlistService from '../services/playlistService';

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { playSong } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      const response = await playlistService.getPlaylistById(playlistId);
      setPlaylist(response.playlist);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song, index) => {
    if (playlist && playlist.musics) {
      playSong(song, playlist.musics, index);
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await playlistService.deletePlaylist(playlistId);
        navigate('/playlists');
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Error deleting playlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading playlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-xl mb-2">Playlist not found</p>
          <Link to="/playlists" className="text-green-400 hover:text-green-300 transition-colors">
            Back to Playlists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/playlists"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors touch-target"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <div className="flex items-start gap-6">
                {/* Playlist Cover */}
                <div className="flex-shrink-0 w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl">
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
                  <div className={`w-full h-full bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-6xl sm:text-8xl font-black text-gray-400 ${playlist.coverImageUrl ? 'hidden' : ''}`}>
                    {playlist.title?.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{playlist.title}</h1>
                  {playlist.description && (
                    <p className="text-gray-400 text-lg mb-2">{playlist.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{playlistService.formatTrackCount(playlist.trackCount || playlist.musics?.length || 0)}</span>
                    {playlist.duration && (
                      <>
                        <span>•</span>
                        <span>{playlistService.formatDuration(playlist.duration)}</span>
                      </>
                    )}
                    {playlist.plays && (
                      <>
                        <span>•</span>
                        <span>{playlist.plays} plays</span>
                      </>
                    )}
                    {playlist.tags && playlist.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex gap-1">
                          {playlist.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Play All Button */}
              {playlist.musics && playlist.musics.length > 0 && (
                <button
                  onClick={() => handlePlaySong(playlist.musics[0], 0)}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-lg touch-target"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Songs List */}
        {(!playlist.musics || playlist.musics.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-xl mb-2">No songs in this playlist</p>
            <p className="text-sm">Add some music to start listening</p>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.musics.map((song, index) => (
              <div
                key={song._id || index}
                className="group flex items-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 touch-target"
              >
                {/* Track Number */}
                <div className="w-8 text-center">
                  <span className="text-gray-400 text-sm group-hover:hidden">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => handlePlaySong(song, index)}
                    className="hidden group-hover:flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full transition-colors touch-target"
                  >
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>

                {/* Album Art */}
                <img
                  src={song.coverImageUrl || 'https://via.placeholder.com/60x60?text=No+Image'}
                  alt={song.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                />

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base sm:text-lg truncate mb-1">
                    {song.title || 'Unknown Title'}
                  </h3>
                  <p className="text-gray-400 text-sm truncate mb-1">
                    {song.artist || 'Unknown Artist'}
                  </p>
                  {song.duration && (
                    <p className="text-gray-500 text-xs">
                      {playlistService.formatDuration(song.duration)}
                    </p>
                  )}
                </div>

                {/* Play Count */}
                {song.plays && (
                  <div className="hidden sm:flex items-center gap-1 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {song.plays}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlaySong(song, index)}
                    className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100 touch-target"
                    title="Play song"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>

                  <button
                    className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-600 rounded-full transition-colors touch-target"
                    title="More options"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacing for mobile player */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
