import { useState, useEffect } from 'react';
import axios from 'axios';

export const useArtistMusic = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get(`${process.env.VITE_MUSIC_API}/api/music/artist-musics`, {
      withCredentials: true
    }).then(res => {
      if (res.data && res.data.musics) {
        setMusics(res.data.musics.map(m =>({
          id: m._id,
          title: m.title || 'Unknown Title',
          artist: m.artist || 'Unknown Artist',
          plays: m.plays || 0,
          status: m.status || "Draft",
          coverImageUrl: m.coverImageUrl || 'https://via.placeholder.com/400x400?text=No+Image',
          musicUrl: m.musicUrl || '',
          duration: m.duration || "3:24",
          releaseDate: m.releaseDate || "2024-01-15"
        })));
      }
    }).catch(err => {
      console.error('Error fetching music:', err);
      setError(err);
      setMusics([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return { musics, loading, error };
};

export const useArtistPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get(`${process.env.VITE_MUSIC_API}/api/music/playlists`, {
      withCredentials: true
    }).then(res => {
      if (res.data && res.data.playlists) {
        setPlaylists(res.data.playlists.map(p => ({
          id: p._id || p.id,
          name: p.name || 'Unknown Playlist',
          description: p.description || '',
          trackCount: p.trackCount || 0,
          plays: p.plays || 0,
          cover: p.cover || '',
          coverImageUrl: p.coverImageUrl || '',
          type: p.type || 'personal',
          title: p.name || 'Unknown Playlist',
          isPublic: p.isPublic || false,
          duration: p.duration || 0,
          musics: p.musics || []
        })));
      }
    }).catch(err => {
      console.error('Error fetching playlists:', err);
      setError(err);
      setPlaylists([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return { playlists, loading, error };
};
