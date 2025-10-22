import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';

export default function ArtistProfile() {
  const { artistId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artistSongs, setArtistSongs] = useState([]);
  const [artistName, setArtistName] = useState(location.state?.artistName || 'Artist');
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    fetchArtistSongs();
  }, [artistId]);

  const fetchArtistSongs = async () => {
    try {
      setLoading(true);
      // Fetch all songs and filter by artistId
      const response = await axios.get('http://localhost:3002/api/music/all', {
        params: { skip: 0, limit: 100 }
      });

      if (response.data && response.data.musics) {
        const filteredSongs = response.data.musics.filter(
          song => song.artistId === artistId
        );
        setArtistSongs(filteredSongs);

        // Set artist name from first song if not provided
        if (filteredSongs.length > 0 && !location.state?.artistName) {
          setArtistName(filteredSongs[0].artist || 'Unknown Artist');
        }
      }
    } catch (error) {
      console.error('Error fetching artist songs:', error);
      setArtistSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const playSong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  const playNext = () => {
    if (currentIndex < artistSongs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentSong(artistSongs[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentSong(artistSongs[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  };

  const playAll = () => {
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], 0);
    }
  };

  const totalPlays = artistSongs.reduce((sum, song) => sum + (song.plays || 0), 0);

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => navigate(-1)}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Back
        </button>

        {/* Artist Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
            <div className="w-58 h-58 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-black text-8xl font-black shadow-2xl flex-shrink-0">
              {artistName.charAt(0).toUpperCase()}
            </div>
            <div className="text-center lg:text-left flex-1">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-400">Verified Artist</span>
              </div>
              <h1 className="text-5xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-none">
                {artistName}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white text-sm">
                <span>{formatNumber(totalPlays)} monthly listeners</span>
                <span className="text-gray-400">•</span>
                <span>{artistSongs.length} song{artistSongs.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-start">
            <button
              className="flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              onClick={playAll}
              disabled={artistSongs.length === 0}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
              Play All
            </button>
          </div>
        </div>

        {/* Songs Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-12 h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Loading songs...</p>
            </div>
          ) : artistSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-lg">No songs available</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-6">Title</div>
                <div className="col-span-3">Plays</div>
                <div className="col-span-2">Duration</div>
              </div>

              <div className="divide-y divide-gray-700">
                {artistSongs.map((song, index) => (
                  <div
                    key={song._id || index}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-700 transition-colors cursor-pointer group ${
                      currentSong?._id === song._id ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div className="col-span-1 flex items-center justify-center text-gray-400 text-sm">
                      {currentSong?._id === song._id ? (
                        <div className="flex gap-0.5 items-end h-4">
                          <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="w-0.5 h-4 bg-green-500 rounded-full animate-pulse delay-150"></span>
                          <span className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse delay-300"></span>
                        </div>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                      <img
                        src={song.coverImageUrl || 'https://via.placeholder.com/40x40?text=No+Image'}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-medium text-sm truncate">{song.title || 'Unknown Title'}</div>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center text-gray-400 text-sm">
                      {formatNumber(song.plays || 0)}
                    </div>

                    <div className="col-span-2 flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{song.duration || '3:24'}</span>
                      <button
                        className="w-8 h-8 bg-transparent hover:bg-green-500 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => playSong(song, index)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Music Player */}
      {currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          onNext={currentIndex < artistSongs.length - 1 ? playNext : null}
          onPrevious={currentIndex > 0 ? playPrevious : null}
          playlist={artistSongs}
        />
      )}
    </div>
  );
}
