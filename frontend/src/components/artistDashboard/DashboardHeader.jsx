import { Link } from 'react-router-dom';

export default function DashboardHeader({ user }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
            Welcome back, {user?.fullname?.firstName || user?.email?.split('@')[0] || 'Artist'}!
          </h1>
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
  );
}
