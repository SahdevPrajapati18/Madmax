import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import playlistService from '../services/playlistService';
import { useArtistMusic, useArtistPlaylists } from './artistDashboard/hooks';
import DashboardHeader from './artistDashboard/DashboardHeader';
import StatsGrid from './artistDashboard/StatsGrid';
import MusicList from './artistDashboard/MusicList';
import PlaylistList from './artistDashboard/PlaylistList';

export default function ArtistDashboard() {
  const { user, playSong } = useAuth();
  const { musics, loading: musicLoading } = useArtistMusic();
  const { playlists, loading: playlistLoading } = useArtistPlaylists();

  const handlePlayPlaylist = async (playlist) => {
    try {
      // If playlist has musics, play the first song
      if (playlist.musics && playlist.musics.length > 0) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader user={user} />

        <StatsGrid musics={musics} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <MusicList musics={musics} loading={musicLoading} playSong={playSong} />
          <PlaylistList playlists={playlists} loading={playlistLoading} handlePlayPlaylist={handlePlayPlaylist} />
        </div>
      </div>
    </div>
  );
}
