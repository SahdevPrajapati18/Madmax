import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import playlistService from '../services/playlistService';
import { useHomeData, useSearch } from './Home/hooks';
import HeroSection from './Home/HeroSection';
import SearchBar from './Home/SearchBar';
import SongsGrid from './Home/SongsGrid';
import ArtistsList from './Home/ArtistsList';
import UserPlaylists from './Home/UserPlaylists';
import PublicPlaylists from './Home/PublicPlaylists';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, playSong } = useAuth();

  const { songs, loading, playlists, publicPlaylists, playlistLoading, refetchSongs } = useHomeData(isAuthenticated);
  const { searchQuery, setSearchQuery, searchType, setSearchType, filteredSongs, groupedByArtist } = useSearch(songs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeroSection isAuthenticated={isAuthenticated} />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
        />

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <p className="text-base sm:text-lg">Loading music...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-base sm:text-lg mb-2">No songs available</p>
            <p className="text-xs sm:text-sm text-center max-w-md">Check your internet connection or try refreshing the page</p>
            <button
              onClick={refetchSongs}
              className="mt-4 px-6 py-3 bg-green-500 text-black rounded-full hover:bg-green-400 transition-colors font-semibold touch-target"
            >
              Retry
            </button>
          </div>
        ) : searchType === 'song' ? (
          <SongsGrid
            songs={filteredSongs}
            searchQuery={searchQuery}
            isAuthenticated={isAuthenticated}
            playSong={playSong}
            navigate={navigate}
          />
        ) : (
          <ArtistsList
            groupedByArtist={groupedByArtist}
            searchQuery={searchQuery}
            isAuthenticated={isAuthenticated}
            playSong={playSong}
            navigate={navigate}
          />
        )}

        {isAuthenticated && (
          <UserPlaylists
            playlists={playlists}
            playlistLoading={playlistLoading}
            isAuthenticated={isAuthenticated}
            playSong={playSong}
            playlistService={playlistService}
          />
        )}

        <PublicPlaylists
          publicPlaylists={publicPlaylists}
          playlistLoading={playlistLoading}
          playSong={playSong}
          playlistService={playlistService}
        />
      </div>
    </div>
  );
}
