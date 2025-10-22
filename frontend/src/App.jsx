import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './components/AuthContext'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import ArtistDashboard from './components/ArtistDashboard'
import UserDashboard from './components/UserDashboard'
import ArtistProfile from './components/ArtistProfile'
import NewTrack from './components/NewTrack'
import MusicPlayer from './components/MusicPlayer'

export default function App() {
  const { user, logout, isAuthenticated, currentSong, currentPlaylist, currentSongIndex, isPlaying, playSong, playNext, playPrevious, togglePlay, stopMusic } = useAuth();

  // Determine user role
  const userRole = user?.role || 'user';
  const isArtist = userRole === 'artist';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-white text-xl font-bold hover:text-green-500 transition-colors">
              MadMax
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  {isArtist && (
                    <Link to="/new-track" className="text-gray-300 hover:text-white transition-colors">
                      Upload
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">
                  Welcome, {user?.fullname?.firstName || user?.email}! ({isArtist ? 'Artist' : 'User'})
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isArtist ? <ArtistDashboard /> : <UserDashboard />} />
          <Route path="/artist/:artistId" element={<ArtistProfile />} />
          <Route path="/new-track" element={<NewTrack />} />
        </Routes>
      </main>

      {/* Global Music Player - Persistent across all pages */}
      {currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          onNext={playNext}
          onPrevious={playPrevious}
          playlist={currentPlaylist}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onStop={stopMusic}
        />
      )}
    </div>
  )
}
