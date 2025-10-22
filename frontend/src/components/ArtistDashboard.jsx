import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';

export default function ArtistDashboard() {
  const [musics, setMusics] = useState([{
    id: 1,
    title: "Midnight Dreams",
    artist: "Artist Name",
    plays: 15000,
    status: "Published",
    coverImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    musicUrl: "/audio/midnight-dreams.mp3",
    duration: "3:24",
    releaseDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Electric Nights",
    artist: "Artist Name",
    plays: 8500,
    status: "Published",
    coverImageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    musicUrl: "/audio/electric-nights.mp3",
    duration: "4:12",
    releaseDate: "2024-02-20"
  },
  {
    id: 3,
    title: "Neon Lights",
    artist: "Artist Name",
    plays: 3200,
    status: "Draft",
    coverImageUrl: "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=400&fit=crop",
    musicUrl: "/audio/neon-lights.mp3",
    duration: "3:45",
    releaseDate: "2024-03-10"
  }
]);

  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: "My Top Hits",
      description: "Your most popular tracks",
      trackCount: 15,
      plays: 125000,
      cover: "",
      type: "personal"
    },
    {
      id: 2,
      name: "Chill Vibes",
      description: "Relaxing electronic beats",
      trackCount: 24,
      plays: 85000,
      cover: "",
      type: "personal"
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [playlistLoading, setPlaylistLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3002/api/music/artist-musics", {
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
      }
    }).catch(err => {
      console.error('Error fetching music:', err);
      setMusics([]);
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
    followers: 12500,
    monthlyEarnings: 2500
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Music Player Functions
  const playSong = (song, songs, index) => {
    // setCurrentSong(song);
    // setCurrentSongIndex(index);
  };

  const playNext = () => {
    // if (playlist.length === 0) return;

    // const nextIndex = (currentSongIndex + 1) % playlist.length;
    // setCurrentSong(playlist[nextIndex]);
    // setCurrentSongIndex(nextIndex);
  };

  const playPrevious = () => {
    // if (playlist.length === 0) return;

    // const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    // setCurrentSong(playlist[prevIndex]);
    // setCurrentSongIndex(prevIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">Welcome back, Artist!</h1>
              <p className="text-base sm:text-lg text-gray-400">Here's what's happening with your music today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/new-track"
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 sm:px-6 py-3 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg touch-target"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm sm:text-base">New Track</span>
              </Link>
              <Link
                to="/playlists/create"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg touch-target"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm sm:text-base">New Playlist</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Plays */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4 sm:p-6 mobile-transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Total Plays</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{formatNumber(stats.totalPlays)}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Musics */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4 sm:p-6 mobile-transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Musics</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{stats.totalSongs}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Followers */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4 sm:p-6 mobile-transition sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Followers</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{formatNumber(stats.followers)}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Musics Section */}
          <div className="xl:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">Musics</h2>
              <Link
                to="/manage-music"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors touch-target"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
                </div>
              ) : musics.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-base sm:text-lg">No music found</p>
                </div>
              ) : (
                musics.map((music, index) => (
                  <div key={music.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer group touch-target" onClick={() => playSong(music, musics, index)}>
                    <img
                      src={music.coverImageUrl}
                      alt={music.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-semibold text-white text-sm sm:text-base mb-1 truncate">{music.title}</h3>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-400">
                        <span>{music.artist}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatNumber(music.plays)} plays</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{music.duration}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{music.releaseDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                      <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-600 rounded-full transition-colors opacity-0 sm:opacity-100 group-hover:opacity-100 touch-target">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-600 rounded-full transition-colors flex-shrink-0 touch-target">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Playlists */}
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
              {playlistLoading ? (
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
        </div>
      </div>
    </div>
  );
}
