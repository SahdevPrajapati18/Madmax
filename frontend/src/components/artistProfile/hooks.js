import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const useArtistSongs = (artistId) => {
  const [artistSongs, setArtistSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate total plays from all artist songs
  const totalPlays = useMemo(() => {
    return artistSongs.reduce((total, song) => total + (song.plays || 0), 0);
  }, [artistSongs]);

  const fetchArtistSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all songs and filter by artistId
      const response = await axios.get(`${process.env.VITE_MUSIC_API}/api/music/public`, {
        withCredentials: true
      });

      if (response.data && response.data.musics) {
        const filteredSongs = response.data.musics.filter(
          song => song.artistId === artistId
        );
        setArtistSongs(filteredSongs);
      }
    } catch (error) {
      console.error('Error fetching artist songs:', error);
      setError(error);
      setArtistSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      fetchArtistSongs();
    }
  }, [artistId]);

  return {
    artistSongs,
    loading,
    error,
    totalPlays,
    refetch: fetchArtistSongs
  };
};

export const useMusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const playSong = (song, playlist, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  const playNext = (playlist) => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentSong(playlist[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const playPrevious = (playlist) => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentSong(playlist[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  };

  const playAll = (playlist) => {
    if (playlist.length > 0) {
      playSong(playlist[0], playlist, 0);
    }
  };

  const stopMusic = () => {
    setCurrentSong(null);
    setCurrentIndex(-1);
  };

  return {
    currentSong,
    currentIndex,
    playSong,
    playNext,
    playPrevious,
    playAll,
    stopMusic
  };
};

export const useSongManagement = () => {
  const [editingSong, setEditingSong] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', artist: '', duration: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleEditSong = (song) => {
    setEditingSong(song);
    setEditForm({
      title: song.title || '',
      artist: song.artist || '',
      duration: song.duration || '3:24'
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${process.env.VITE_MUSIC_API}/api/music/${editingSong._id}`,
        editForm,
        { withCredentials: true }
      );

      if (response.data.success) {
        setEditingSong(null);
        setEditForm({ title: '', artist: '', duration: '' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating song:', error);
      return false;
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      const response = await axios.delete(
        `${process.env.VITE_MUSIC_API}/api/music/${songId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setShowDeleteConfirm(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting song:', error);
      return false;
    }
  };

  const handleCancelEdit = () => {
    setEditingSong(null);
    setEditForm({ title: '', artist: '', duration: '' });
  };

  return {
    editingSong,
    editForm,
    setEditForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleEditSong,
    handleSaveEdit,
    handleDeleteSong,
    handleCancelEdit
  };
};
