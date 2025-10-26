import { useState, useEffect } from 'react';
import axios from 'axios';
import playlistService from '../../services/playlistService';
import { filterSongs, groupSongsByArtist } from './utils';

export const useHomeData = (isAuthenticated) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      console.log('Fetching songs from:', `${process.env.VITE_MUSIC_API}/api/music/public`);
      const response = await axios.get(`${process.env.VITE_MUSIC_API}/api/music/public`, {
        params: { skip: 0, limit: 50 }
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.musics) {
        console.log(`Found ${response.data.musics.length} songs`);
        setSongs(response.data.musics);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where response.data is directly an array
        console.log(`Found ${response.data.length} songs (direct array)`);
        setSongs(response.data);
      } else {
        console.log('No musics field in response, response.data:', response.data);
        setSongs([]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      console.error('Error details:', error.response?.data || error.message);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      setPlaylistLoading(true);
      const response = await playlistService.getPlaylists();
      setPlaylists(response.playlists || []);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    } finally {
      setPlaylistLoading(false);
    }
  };

  const fetchPublicPlaylists = async () => {
    try {
      const response = await playlistService.getPublicPlaylists();
      setPublicPlaylists(response.playlists || []);
    } catch (error) {
      console.error('Error fetching public playlists:', error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPlaylists();
      fetchPublicPlaylists();
    }
  }, [isAuthenticated]);

  return {
    songs,
    loading,
    playlists,
    publicPlaylists,
    playlistLoading,
    refetchSongs: fetchSongs,
    refetchPlaylists: fetchUserPlaylists,
    refetchPublicPlaylists: fetchPublicPlaylists
  };
};

export const useSearch = (songs) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('song'); // 'song' or 'artist'

  const filteredSongs = filterSongs(songs, searchQuery, searchType);
  const groupedByArtist = groupSongsByArtist(filteredSongs);

  return {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    filteredSongs,
    groupedByArtist
  };
};
