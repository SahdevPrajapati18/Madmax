import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import playlistService from '../services/playlistService';
import { useUserMusic, useUserPlaylists } from './userDashboard/hooks';
import DashboardHeader from './userDashboard/DashboardHeader';
import StatsGrid from './userDashboard/StatsGrid';
import RecentlyPlayed from './userDashboard/RecentlyPlayed';
import UserPlaylists from './userDashboard/UserPlaylists';

export default function UserDashboard() {
  const { user, playSong } = useAuth();
  const { musics, loading: musicLoading, stats } = useUserMusic();
  const { playlists, loading: playlistLoading } = useUserPlaylists();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader user={user} />

        <StatsGrid stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RecentlyPlayed musics={musics} loading={musicLoading} playSong={playSong} />

          <UserPlaylists
            playlists={playlists}
            loading={playlistLoading}
            playSong={playSong}
            playlistService={playlistService}
          />
        </div>
      </div>
    </div>
  );
}
