import axios from 'axios';

const API_BASE_URL = `${process.env.MUSIC_API}/api/music`;

class PlaylistService {
    // Get user's playlists
    async getPlaylists() {
        try {
            const response = await axios.get(`${API_BASE_URL}/playlists`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    }

    // Get public playlists
    async getPublicPlaylists() {
        try {
            const response = await axios.get(`${API_BASE_URL}/public-playlists`);
            return response.data;
        } catch (error) {
            console.error('Error fetching public playlists:', error);
            throw error;
        }
    }

    // Get specific playlist by ID
    async getPlaylistById(playlistId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/playlist/${playlistId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching playlist:', error);
            throw error;
        }
    }

    // Create new playlist
    async createPlaylist(playlistData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/playlist`, playlistData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error creating playlist:', error);
            throw error;
        }
    }

    // Update playlist
    async updatePlaylist(playlistId, playlistData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/playlist/${playlistId}`, playlistData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error updating playlist:', error);
            throw error;
        }
    }

    // Delete playlist
    async deletePlaylist(playlistId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/playlist/${playlistId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    }

    // Add music to playlist
    async addToPlaylist(playlistId, musicId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/playlist/${playlistId}/add`, { musicId }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to playlist:', error);
            throw error;
        }
    }

    // Remove music from playlist
    async removeFromPlaylist(playlistId, musicId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/playlist/${playlistId}/remove`, { musicId }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from playlist:', error);
            throw error;
        }
    }

    // Get all music for adding to playlists
    async getAllMusic() {
        try {
            const response = await axios.get(`${API_BASE_URL}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching music:', error);
            throw error;
        }
    }

    // Format duration from seconds to readable format
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '0:00';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Format track count with proper pluralization
    formatTrackCount(count) {
        if (count === 1) return '1 track';
        return `${count} tracks`;
    }
}

export default new PlaylistService();
