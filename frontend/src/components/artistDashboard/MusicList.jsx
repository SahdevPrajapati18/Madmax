import { Link } from 'react-router-dom';
import { formatNumber } from './utils';

export default function MusicList({ musics, loading, playSong }) {
  return (
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
  );
}
