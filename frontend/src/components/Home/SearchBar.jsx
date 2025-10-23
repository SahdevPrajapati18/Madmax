export default function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder={`Search for ${searchType === 'song' ? 'songs' : 'artists'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-base touch-target"
          />
        </div>

        <div className="flex bg-gray-800/80 backdrop-blur-sm p-1 rounded-full border border-gray-700">
          <button
            className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm transition-colors touch-target ${
              searchType === 'song'
                ? 'bg-green-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setSearchType('song')}
          >
            Songs
          </button>
          <button
            className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm transition-colors touch-target ${
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
    </div>
  );
}
