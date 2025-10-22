import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import playlistService from '../services/playlistService';

export default function CreatePlaylist() {
  const navigate = useNavigate();
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
      tags: ''
    }
  });

  const isPublic = watch('isPublic');

  useEffect(() => {
    fetchAvailableSongs();
  }, []);

  const fetchAvailableSongs = async () => {
    try {
      const response = await playlistService.getAllMusic();
      setAvailableSongs(response.musics || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSongSelection = (song) => {
    setSelectedSongs(prev => {
      const isSelected = prev.some(s => s._id === song._id);
      if (isSelected) {
        return prev.filter(s => s._id !== song._id);
      } else {
        return [...prev, song];
      }
    });
  };

  const removeFromSelection = (songId) => {
    setSelectedSongs(prev => prev.filter(s => s._id !== songId));
  };

  const onSubmit = async (data) => {
    if (selectedSongs.length === 0) {
      alert('Please select at least one song for your playlist');
      return;
    }

    setSubmitting(true);
    try {
      const playlistData = {
        title: data.title,
        description: data.description,
        musics: selectedSongs.map(song => song._id),
        isPublic: data.isPublic,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      await playlistService.createPlaylist(playlistData);
      navigate('/playlists');
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Error creating playlist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/playlists"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors touch-target"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Create Playlist</h1>
              <p className="text-gray-400 text-lg">Build your perfect music collection</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-300">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="My Awesome Playlist"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 touch-target"
                  {...register("title", {
                    required: "Playlist title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters"
                    },
                    maxLength: {
                      value: 100,
                      message: "Title must be less than 100 characters"
                    }
                  })}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Tell people about this playlist..."
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 resize-none"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description must be less than 500 characters"
                    }
                  })}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-sm font-semibold text-gray-300">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  placeholder="rock, indie, upbeat (comma separated)"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 touch-target"
                  {...register("tags")}
                />
                <p className="text-gray-500 text-xs">Separate tags with commas</p>
              </div>

              {/* Privacy */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-300">
                  Privacy
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value={false}
                      {...register("isPublic")}
                      className="w-4 h-4 text-green-500 focus:ring-green-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-300">Private</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value={true}
                      {...register("isPublic")}
                      className="w-4 h-4 text-green-500 focus:ring-green-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-300">Public</span>
                  </label>
                </div>
                <p className="text-gray-500 text-xs">
                  {isPublic
                    ? 'Anyone can discover and listen to this playlist'
                    : 'Only you can see and play this playlist'
                  }
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || selectedSongs.length === 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 touch-target shadow-lg"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Creating Playlist...
                  </div>
                ) : (
                  `Create Playlist (${selectedSongs.length} songs)`
                )}
              </button>
            </form>
          </div>

          {/* Song Selection Section */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Select Songs</h2>
              <p className="text-gray-400 text-sm">Choose songs to add to your playlist</p>
            </div>

            {/* Selected Songs */}
            {selectedSongs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Selected ({selectedSongs.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedSongs.map((song) => (
                    <div key={song._id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <img
                        src={song.coverImageUrl || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{song.title}</p>
                        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                      </div>
                      <button
                        onClick={() => removeFromSelection(song._id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors touch-target"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Songs */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Available Songs</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableSongs.map((song) => {
                  const isSelected = selectedSongs.some(s => s._id === song._id);
                  return (
                    <div
                      key={song._id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors touch-target ${
                        isSelected
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'hover:bg-gray-700/50 border border-transparent'
                      }`}
                      onClick={() => toggleSongSelection(song)}
                    >
                      <img
                        src={song.coverImageUrl || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{song.title}</p>
                        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                        {song.duration && (
                          <p className="text-gray-500 text-xs">
                            {playlistService.formatDuration(song.duration)}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>

              {availableSongs.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="text-lg">No songs available</p>
                  <p className="text-sm">Upload some music first to create playlists</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
