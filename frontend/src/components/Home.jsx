import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';
import { useAuth } from './AuthContext';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('song'); // 'song' or 'artist'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, currentSong, currentPlaylist, currentSongIndex, playSong } = useAuth();

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    filterSongs();
  }, [searchQuery, searchType, songs]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      console.log('Fetching songs from:', 'http://localhost:3002/api/music/public');
      const response = await axios.get('http://localhost:3002/api/music/public', {
        params: { skip: 0, limit: 50 }
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.musics) {
        console.log(`Found ${response.data.musics.length} songs`);
        setSongs(response.data.musics);
        setFilteredSongs(response.data.musics);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where response.data is directly an array
        console.log(`Found ${response.data.length} songs (direct array)`);
        setSongs(response.data);
        setFilteredSongs(response.data);
      } else {
        console.log('No musics field in response, response.data:', response.data);
        setSongs([]);
        setFilteredSongs([]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      console.error('Error details:', error.response?.data || error.message);
      setSongs([]);
      setFilteredSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = () => {
    if (!searchQuery.trim()) {
      setFilteredSongs(songs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = songs.filter(song => {
      if (searchType === 'song') {
        return song.title?.toLowerCase().includes(query);
      } else {
        return song.artist?.toLowerCase().includes(query);
      }
    });
    setFilteredSongs(filtered);
  };

  const handleArtistClick = (artistId, artistName) => {
    navigate(`/artist/${artistId}`, { state: { artistName } });
  };

  // Group songs by artist for the artist search view
  const groupedByArtist = filteredSongs.reduce((acc, song) => {
    const artist = song.artist || 'Unknown Artist';
    if (!acc[artist]) {
      acc[artist] = {
        name: artist,
        artistId: song.artistId,
        songs: []
      };
    }
    acc[artist].songs.push(song);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
            Discover Music
          </h1>
          <p className="text-lg text-gray-400 mb-4">Browse and play your favorite songs</p>
          {!isAuthenticated && (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <div className="flex-1">
                  <p className="text-green-400 font-semibold">Login Required for Music Playback</p>
                  <p className="text-green-300 text-sm">Sign in to listen to songs and access full playlist features</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-4 py-2 rounded-full font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder={`Search for ${searchType === 'song' ? 'songs' : 'artists'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>

          <div className="flex bg-gray-800 p-1 rounded-full border border-gray-700">
            <button
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                searchType === 'song'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSearchType('song')}
            >
              Songs
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                searchType === 'artist'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSearchType('artist')}
            >
              Artists
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading music...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-lg mb-2">No songs available</p>
            <p className="text-sm">Check your internet connection or try refreshing the page</p>
            <button
              onClick={fetchSongs}
              className="mt-4 px-4 py-2 bg-green-500 text-black rounded-full hover:bg-green-400 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : searchType === 'song' ? (
          /* Songs Grid View */
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {searchQuery ? `Search Results (${filteredSongs.length})` : 'All Songs'}
            </h2>
            {filteredSongs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-lg">No songs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredSongs.map((song, index) => (
                  <div
                    key={song._id || song.id || index}
                    className="group bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="relative mb-4 aspect-square">
                      <img
                        src={song.coverImageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={song.title || 'Unknown Title'}
                        className="w-full h-full object-cover rounded-md shadow-lg"
                      />
                      {isAuthenticated && (
                        <button
                          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                          onClick={() => playSong(song, filteredSongs, index)}
                        >
                          <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5.14v14l11-7-11-7z" />
                          </svg>
                        </button>
                      )}
                      {!isAuthenticated && (
                        <div className="absolute bottom-2 right-2 w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-semibold text-sm truncate">{song.title || 'Unknown Title'}</h3>
                      <button
                        className="text-gray-400 text-sm hover:text-white hover:underline transition-colors text-left"
                        onClick={() => handleArtistClick(song.artistId, song.artist)}
                      >
                        {song.artist || 'Unknown Artist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Artists List View */
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {searchQuery ? `Artists Found (${Object.keys(groupedByArtist).length})` : 'All Artists'}
            </h2>
            {Object.keys(groupedByArtist).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-lg mb-2">No artists found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.values(groupedByArtist).map((artist, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                    <div
                      className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700 cursor-pointer group"
                      onClick={() => handleArtistClick(artist.artistId, artist.name)}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-black text-2xl font-bold flex-shrink-0">
                        {artist.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
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
                        <div key={song._id || songIndex} className="flex items-center gap-3 p-2 rounded hover:bg-gray-600 transition-colors">
                          <img
                            src={song.coverImageUrl || 'https://via.placeholder.com/50x50?text=No+Image'}
                            alt={song.title}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{song.title}</p>
                          </div>
                          <button
                            className={`w-8 h-8 ${isAuthenticated ? 'bg-transparent hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'} rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-all flex-shrink-0`}
                            onClick={() => isAuthenticated ? playSong(song, filteredSongs, filteredSongs.indexOf(song)) : alert('Please log in to play music')}
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
                          className="col-span-full p-3 bg-transparent border border-gray-600 rounded-lg text-white text-sm font-semibold hover:border-white hover:scale-105 transition-all text-center"
                          onClick={() => handleArtistClick(artist.artistId, artist.name)}
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
        )}
      </div>
    </div>
  );
}
