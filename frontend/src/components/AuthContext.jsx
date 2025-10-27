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
  const [error, setError] = useState('');

  // Global music state
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('token');
    const error = urlParams.get('error');

    if (oauthToken) {
      console.log('🔑 OAuth callback received token');
      localStorage.setItem('token', oauthToken);
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
      checkAuthStatus(oauthToken);
    } else if (error) {
      console.error('❌ OAuth error:', error);
      // Remove error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      setError(error);
    }
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

  const checkAuthStatus = async (token) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User is not authenticated
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data && response.data.token && response.data.user) {
        console.log('AuthContext login success, user:', response.data.user);
        console.log('User role:', response.data.user.role);

        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
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
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        email,
        password,
        fullname: {
          firstName,
          lastName
        },
        role
      });

      if (response.data && response.data.token && response.data.user) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
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
      // Clear token from localStorage (no backend call needed for JWT logout)
      localStorage.removeItem('token');
      setUser(null);

      // Reset music state on logout
      setCurrentSong(null);
      setCurrentPlaylist([]);
      setCurrentSongIndex(-1);
      setIsPlaying(false);

      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
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

  const loginWithGoogle = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';
    console.log('🔄 Redirecting to Google OAuth:', `${BACKEND_URL}/api/auth/google`);
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
    error,
    clearError,
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
