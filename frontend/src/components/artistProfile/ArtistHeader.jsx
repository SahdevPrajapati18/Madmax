import { formatNumber } from './utils';

export default function ArtistHeader({ artistName, totalPlays, songCount, onPlayAll, hasSongs }) {
  return (
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
            <span>{songCount} song{songCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center lg:justify-start">
        <button
          className="flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          onClick={onPlayAll}
          disabled={!hasSongs}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
          Play All
        </button>
      </div>
    </div>
  );
}
