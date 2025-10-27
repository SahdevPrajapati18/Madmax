import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import API from '../services/api.js';

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

  // Track if redirect has been done
  const redirectDone = useRef(false);

  // Initial auth check and OAuth handling
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        console.log('🔍 Token from localStorage:', token ? 'exists' : 'not found');

        // Handle OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('token');
        const errorParam = urlParams.get('error');

        if (oauthToken) {
          console.log('🔑 OAuth callback received token');
          localStorage.setItem('token', oauthToken);
          // Remove token from URL for security
          window.history.replaceState({}, document.title, window.location.pathname);
          await checkAuthStatus(oauthToken);
        } else if (errorParam) {
          console.error('❌ OAuth error:', errorParam);
          // Remove error from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          setError(errorParam);
          setLoading(false);
        } else if (token) {
          // Check existing token
          await checkAuthStatus(token);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Auth initialization error:', err);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle user changes and redirects
  useEffect(() => {
    if (user) {
      console.log('✅ AuthContext user updated:', user);
      console.log('👤 User role:', user.role);
      console.log('🎵 User artistId:', user.artistId);
      console.log('📍 Current location:', window.location.pathname);

      // Redirect artist users to dashboard (only once per login)
      if (user?.role === 'artist' && !window.location.pathname.startsWith('/dashboard') && !redirectDone.current) {
        console.log('🔄 Redirecting artist user to dashboard');
        redirectDone.current = true;
        window.location.replace('/dashboard');
      }
    } else {
      // Reset redirect flag on logout
      redirectDone.current = false;
      console.log('👋 User logged out, redirect flag reset');
    }
  }, [user]);

  const checkAuthStatus = async (token) => {
    try {
      const response = await API.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.user) {
        console.log('✅ Auth check successful, user:', response.data.user);
        setUser(response.data.user);
      } else {
        console.warn('⚠️ No user data in response');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error?.response?.status, error?.message);
      // User is not authenticated
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login for:', email);
      const response = await API.post('/auth/login', {
        email,
        password
      });

      if (response.data?.token && response.data?.user) {
        console.log('✅ Login successful, user:', response.data.user);
        console.log('👤 User role:', response.data.user.role);

        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        redirectDone.current = false; // Reset redirect flag on new login
        
        return { success: true, user: response.data.user };
      } else {
        console.warn('⚠️ Incomplete login response');
        return {
          success: false,
          error: 'Invalid server response'
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      console.error('❌ Login error:', errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    }
  };

  const register = async (email, password, firstName, lastName, role = 'user') => {
    try {
      console.log('🔄 Attempting registration for:', email, 'as role:', role);
      const response = await API.post('/auth/register', {
        email,
        password,
        fullname: {
          firstName,
          lastName
        },
        role
      });

      if (response.data?.token && response.data?.user) {
        console.log('✅ Registration successful, user:', response.data.user);

        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        redirectDone.current = false; // Reset redirect flag on new registration
        
        return { success: true, user: response.data.user };
      } else {
        console.warn('⚠️ Incomplete registration response');
        return {
          success: false,
          error: 'Invalid server response'
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      console.error('❌ Registration error:', errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Logging out user');
      // Clear token from localStorage (no backend call needed for JWT logout)
      localStorage.removeItem('token');
      setUser(null);

      // Reset music state on logout
      setCurrentSong(null);
      setCurrentPlaylist([]);
      setCurrentSongIndex(-1);
      setIsPlaying(false);

      // Reset redirect flag
      redirectDone.current = false;

      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const clearError = () => {
    setError('');
  };

  // Global music functions
  const playSong = useCallback((song, playlist = [], index = -1) => {
    console.log('🎵 Playing song:', song?.title || song?.name);
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(index);
    setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => {
    if (currentPlaylist.length === 0 || currentSongIndex === -1) {
      console.warn('⚠️ Cannot play next: no playlist or invalid index');
      return;
    }

    const nextIndex = (currentSongIndex + 1) % currentPlaylist.length;
    console.log('⏭️ Playing next song, index:', nextIndex);
    setCurrentSong(currentPlaylist[nextIndex]);
    setCurrentSongIndex(nextIndex);
  }, [currentPlaylist, currentSongIndex]);

  const playPrevious = useCallback(() => {
    if (currentPlaylist.length === 0 || currentSongIndex === -1) {
      console.warn('⚠️ Cannot play previous: no playlist or invalid index');
      return;
    }

    const prevIndex = currentSongIndex === 0 ? currentPlaylist.length - 1 : currentSongIndex - 1;
    console.log('⏮️ Playing previous song, index:', prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
    setCurrentSongIndex(prevIndex);
  }, [currentPlaylist, currentSongIndex]);

  const togglePlay = useCallback(() => {
    console.log('⏯️ Toggle play:', !isPlaying ? 'playing' : 'paused');
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const stopMusic = useCallback(() => {
    console.log('⏹️ Stopping music');
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