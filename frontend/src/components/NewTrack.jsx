import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function NewTrack() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    music: null,
    coverImage: null
  });
  const [previews, setPreviews] = useState({
    coverImage: null,
    music: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  // Pre-populate artist name from user profile
  useEffect(() => {
    if (!authLoading && user && user.fullname) {
      const artistName = `${user.fullname.firstName} ${user.fullname.lastName}`;
      setFormData(prev => ({
        ...prev,
        artist: artistName
      }));
    }
  }, [user, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      // Create preview
      if (name === 'coverImage') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            coverImage: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else if (name === 'music') {
        const audio = new Audio(URL.createObjectURL(file));
        setAudioRef(audio);
        setPreviews(prev => ({
          ...prev,
          music: file
        }));
      }

      // Clear error
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.music) {
      newErrors.music = 'Music file is required';
    } else {
      // Check file type
      const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a'];
      if (!allowedAudioTypes.includes(formData.music.type)) {
        newErrors.music = 'Please select a valid audio file (MP3, WAV, M4A)';
      }
      // Check file size (max 50MB)
      if (formData.music.size > 50 * 1024 * 1024) {
        newErrors.music = 'File size must be less than 50MB';
      }
    }

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    } else {
      // Check file type
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedImageTypes.includes(formData.coverImage.type)) {
        newErrors.coverImage = 'Please select a valid image file (JPEG, PNG, WebP)';
      }
      // Check file size (max 10MB)
      if (formData.coverImage.size > 10 * 1024 * 1024) {
        newErrors.coverImage = 'Image size must be less than 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('music', formData.music);
      formDataToSend.append('coverImage', formData.coverImage);

      const response = await axios.post('http://localhost:3002/api/music/upload', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        // Success - redirect to dashboard
        navigate('/artist/dashboard');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/artist/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Upload New Track</h1>
          <p className="text-gray-400 text-lg">Share your music with the world</p>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
                Track Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your track title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Artist Name */}
            <div>
              <label htmlFor="artist" className="block text-sm font-semibold text-white mb-2">
                Artist Name
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={authLoading ? 'Loading...' : formData.artist}
                readOnly
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                placeholder={authLoading ? "Loading artist name..." : "Artist name from profile"}
              />
              <p className="text-gray-400 text-xs mt-1">
                {authLoading ? 'Loading profile...' : 'Auto-filled from your profile'}
              </p>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Cover Image *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />
                <label htmlFor="coverImage" className="cursor-pointer">
                  {previews.coverImage ? (
                    <div className="space-y-4">
                      <img
                        src={previews.coverImage}
                        alt="Cover preview"
                        className="w-48 h-48 object-cover rounded-lg mx-auto"
                      />
                      <div className="text-center">
                        <p className="text-green-500 text-sm mb-2">✓ Image uploaded successfully</p>
                        <p className="text-gray-400 text-xs">Click to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400">Click to upload cover image</p>
                      <p className="text-gray-500 text-xs">JPEG, PNG, WebP (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
            </div>

            {/* Music File Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Music File *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  id="music"
                  name="music"
                  onChange={handleFileChange}
                  accept="audio/mpeg,audio/wav,audio/mp3,audio/m4a"
                  className="hidden"
                />
                <label htmlFor="music" className="cursor-pointer">
                  {previews.music ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={toggleAudioPlayback}
                          className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? (
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                        <div className="text-left">
                          <p className="text-white font-medium">{previews.music.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(previews.music.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-green-500 text-sm mb-2">✓ Audio uploaded successfully</p>
                        <p className="text-gray-400 text-xs">Click to change audio file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <p className="text-gray-400">Click to upload music file</p>
                      <p className="text-gray-500 text-xs">MP3, WAV, M4A (max 50MB)</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.music && <p className="text-red-500 text-sm mt-1">{errors.music}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-black font-bold px-8 py-4 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <span>Upload Track</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
