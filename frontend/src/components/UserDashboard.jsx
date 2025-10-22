import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function UserDashboard() {
  const { user, playSong } = useAuth();
  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlistLoading, setPlaylistLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3002/api/music", {
      withCredentials: true
    }).then(res => {
      if (res.data && res.data.musics) {
        setMusics(res.data.musics.map(m =>({
          id: m._id,
          title: m.title || 'Unknown Title',
          artist: m.artist || 'Unknown Artist',
          plays: m.plays || 0,
          status: m.status || "Draft",
          coverImageUrl: m.coverImageUrl || 'https://via.placeholder.com/400x400?text=No+Image',
          musicUrl: m.musicUrl || '',
          duration: m.duration || "3:24",
          releaseDate: m.releaseDate || "2024-01-15"
        })));
        // Set up playlist for music player
        const musicPlaylist = res.data.musics.map(m => ({
          id: m._id,
          title: m.title || 'Unknown Title',
          artist: m.artist || 'Unknown Artist',
          coverImageUrl: m.coverImageUrl || 'https://via.placeholder.com/400x400?text=No+Image',
          musicUrl: m.musicUrl || '',
          duration: m.duration || "3:24"
        }));
        setPlaylist(musicPlaylist);
      }
    }).catch(err => {
      console.error('Error fetching music:', err);
      setMusics([]);
      setPlaylist([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setPlaylistLoading(true);
    axios.get("http://localhost:3002/api/music/playlists", {
      withCredentials: true
    }).then(res => {
      if (res.data && res.data.playlists) {
        setPlaylists(res.data.playlists.map(p => ({
          id: p._id || p.id,
          name: p.name || 'Unknown Playlist',
          description: p.description || '',
          trackCount: p.trackCount || 0,
          plays: p.plays || 0,
          cover: p.cover || '',
          type: p.type || 'personal'
        })));
      }
    }).catch(err => {
      console.error('Error fetching playlists:', err);
      setPlaylists([]);
    }).finally(() => {
      setPlaylistLoading(false);
    });
  }, []);

  // Calculate stats
  const stats = {
    totalPlays: musics.reduce((sum, music) => sum + (music.plays || 0), 0),
    totalSongs: musics.length,
    favoriteArtists: 12,
    listeningTime: "24h 15m"
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Welcome back, {user?.fullname?.firstName || 'Music Lover'}!</h1>
              <p className="text-gray-400 text-lg">Discover and enjoy your favorite music.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>Discover Music</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Plays */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-1">Total Plays</p>
                <p className="text-3xl font-black text-white">{formatNumber(stats.totalPlays)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Songs Listened */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-1">Songs Listened</p>
                <p className="text-3xl font-black text-white">{stats.totalSongs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Favorite Artists */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-1">Favorite Artists</p>
                <p className="text-3xl font-black text-white">{stats.favoriteArtists}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Listening Time */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-1">Listening Time</p>
                <p className="text-3xl font-black text-white">{stats.listeningTime}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recently Played Section */}
          <div className="xl:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Recently Played</h2>
              <Link
                to="/"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
                </div>
              ) : musics.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No music found</p>
                </div>
              ) : (
                musics.slice(0, 5).map((music, index) => (
                  <div key={music.id} className="flex items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer group" onClick={() => playSong(music, musics, index)}>
                    <img
                      src={music.coverImageUrl}
                      alt={music.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">{music.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span>{music.artist}</span>
                        <span>•</span>
                        <span>{formatNumber(music.plays)} plays</span>
                        <span>•</span>
                        <span>{music.duration}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Playlists */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Popular Playlists</h2>
              <Link
                to="/playlists"
                className="text-green-500 hover:text-green-400 text-sm font-semibold transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {playlistLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                playlists.slice(0, 4).map((playlist) => (
                  <div key={playlist.id} className="group cursor-pointer">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {playlist.cover}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm truncate">{playlist.name}</h3>
                          {playlist.type === 'featured' && (
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{playlist.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{playlist.trackCount} tracks</span>
                          <span>•</span>
                          <span>{formatNumber(playlist.plays)} plays</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
