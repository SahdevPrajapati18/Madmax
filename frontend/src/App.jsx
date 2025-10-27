import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './components/AuthContext'
import ResponsiveHeader from './components/ResponsiveHeader'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import ArtistDashboard from './components/ArtistDashboard'
import UserDashboard from './components/UserDashboard'
import ArtistProfile from './components/ArtistProfile'
import NewTrack from './components/NewTrack'
import MusicPlayer from './components/musicPlayer/MusicPlayer'
import Playlists from './components/Playlists'
import CreatePlaylist from './components/CreatePlaylist'
import PlaylistDetail from './components/PlaylistDetail'
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  const { user, logout, isAuthenticated, currentSong, currentPlaylist, currentSongIndex, isPlaying, playSong, playNext, playPrevious, togglePlay, stopMusic } = useAuth();

  // Determine user role
  const userRole = user?.role || 'user';
  const isArtist = userRole === 'artist';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Responsive Navigation */}
      <ResponsiveHeader />

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isArtist ? <ArtistDashboard /> : <UserDashboard />} />
          <Route path="/new-track" element={<NewTrack />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/create" element={<CreatePlaylist />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
          <Route path="/artist/:artistId" element={<ArtistProfile />} />
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
      <SpeedInsights/>
    </div>
  )
}
