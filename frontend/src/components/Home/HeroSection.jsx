import { Link } from 'react-router-dom';

export default function HeroSection({ isAuthenticated }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 tracking-tight">
        Discover Music
      </h1>
      <p className="text-base sm:text-lg text-gray-400 mb-4">Browse and play your favorite songs</p>
      {!isAuthenticated && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <div className="flex-1">
              <p className="text-green-400 font-semibold text-sm sm:text-base">Login Required for Music Playback</p>
              <p className="text-green-300 text-xs sm:text-sm">Sign in to listen to songs and access full playlist features</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full font-semibold transition-colors text-center text-sm touch-target"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-4 py-2 rounded-full font-semibold transition-colors text-center text-sm touch-target"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
