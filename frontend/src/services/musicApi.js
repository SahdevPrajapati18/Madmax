import axios from 'axios';

const MUSIC_API = axios.create({
  baseURL: 'https://adventurous-miracle-production.up.railway.app/api/music',
});

// Attach JWT automatically
MUSIC_API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default MUSIC_API;
