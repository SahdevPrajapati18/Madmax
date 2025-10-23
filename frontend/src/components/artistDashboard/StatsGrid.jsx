import { formatNumber } from './utils';

export default function StatsGrid({ musics }) {
  // Calculate stats
  const stats = {
    totalPlays: musics.reduce((sum, music) => sum + (music.plays || 0), 0),
    totalSongs: musics.length,
    followers: 12500,
    monthlyEarnings: 2500
  };

  return (
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

      {/* Monthly Earnings */}
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4 sm:p-6 mobile-transition sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Monthly Earnings</p>
            <p className="text-2xl sm:text-3xl font-black text-white">${formatNumber(stats.monthlyEarnings)}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
