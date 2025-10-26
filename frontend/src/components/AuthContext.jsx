import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useKeyboardShortcuts } from './musicPlayer/useKeyboardShortcuts';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global music state
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Debug: Log user changes and check for unwanted redirects
    if (user) {
      console.log('AuthContext user updated:', user);
      console.log('User role:', user.role);
      console.log('User artistId:', user.artistId);
      console.log('Current location:', window.location.pathname);

      // Check if user is being redirected to wrong location
      if (user?.role === 'artist' && !window.location.pathname.startsWith('/dashboard')) {
        window.location.replace('/dashboard');
      }
    }
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${process.env.VITE_AUTH_API}/api/auth/me`, {
        withCredentials: true
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.VITE_AUTH_API}/api/auth/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.user) {
        console.log('AuthContext login success, user:', response.data.user);
        console.log('User role:', response.data.user.role);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (email, password, firstName, lastName, role = 'user') => {
    try {
      const response = await axios.post(`${process.env.VITE_AUTH_API}/api/auth/register`, {
        email,
        password,
        fullname: {
          firstName,
          lastName
        },
        role
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.VITE_AUTH_API}/api/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Reset music state on logout
      setCurrentSong(null);
      setCurrentPlaylist([]);
      setCurrentSongIndex(-1);
      setIsPlaying(false);
    }
  };

  // Global music functions
  const playSong = useCallback((song, playlist = [], index = -1) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(index);
    setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => {
    if (currentPlaylist.length === 0 || currentSongIndex === -1) return;

    const nextIndex = (currentSongIndex + 1) % currentPlaylist.length;
    setCurrentSong(currentPlaylist[nextIndex]);
    setCurrentSongIndex(nextIndex);
  }, [currentPlaylist, currentSongIndex]);

  const playPrevious = useCallback(() => {
    if (currentPlaylist.length === 0 || currentSongIndex === -1) return;

    const prevIndex = currentSongIndex === 0 ? currentPlaylist.length - 1 : currentSongIndex - 1;
    setCurrentSong(currentPlaylist[prevIndex]);
    setCurrentSongIndex(prevIndex);
  }, [currentPlaylist, currentSongIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stopMusic = useCallback(() => {
    setCurrentSong(null);
    setCurrentPlaylist([]);
    setCurrentSongIndex(-1);
    setIsPlaying(false);
  }, []);

  // Setup global keyboard shortcuts
  useKeyboardShortcuts(togglePlay, playNext, playPrevious);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    // Global music state
    currentSong,
    currentPlaylist,
    currentSongIndex,
    isPlaying,
    playSong,
    playNext,
    playPrevious,
    togglePlay,
    stopMusic
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
