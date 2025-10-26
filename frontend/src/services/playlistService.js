import API from './api.js';

class PlaylistService {
    // Get user's playlists
    async getPlaylists() {
        try {
            const response = await API.get('/music/playlists');
            return response.data;
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    }

    // Get public playlists
    async getPublicPlaylists() {
        try {
            const response = await API.get('/music/public-playlists');
            return response.data;
        } catch (error) {
            console.error('Error fetching public playlists:', error);
            throw error;
        }
    }

    // Get specific playlist by ID
    async getPlaylistById(playlistId) {
        try {
            const response = await API.get(`/music/playlist/${playlistId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching playlist:', error);
            throw error;
        }
    }

    // Create new playlist
    async createPlaylist(playlistData) {
        try {
            const response = await API.post('/music/playlist', playlistData);
            return response.data;
        } catch (error) {
            console.error('Error creating playlist:', error);
            throw error;
        }
    }

    // Update playlist
    async updatePlaylist(playlistId, playlistData) {
        try {
            const response = await API.put(`/music/playlist/${playlistId}`, playlistData);
            return response.data;
        } catch (error) {
            console.error('Error updating playlist:', error);
            throw error;
        }
    }

    // Delete playlist
    async deletePlaylist(playlistId) {
        try {
            const response = await API.delete(`/music/playlist/${playlistId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    }

    // Add music to playlist
    async addToPlaylist(playlistId, musicId) {
        try {
            const response = await API.post(`/music/playlist/${playlistId}/add`, { musicId });
            return response.data;
        } catch (error) {
            console.error('Error adding to playlist:', error);
            throw error;
        }
    }

    // Remove music from playlist
    async removeFromPlaylist(playlistId, musicId) {
        try {
            const response = await API.post(`/music/playlist/${playlistId}/remove`, { musicId });
            return response.data;
        } catch (error) {
            console.error('Error removing from playlist:', error);
            throw error;
        }
    }

    // Get all music for adding to playlists
    async getAllMusic() {
        try {
            const response = await API.get('/music');
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
