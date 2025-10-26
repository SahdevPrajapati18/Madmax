import { useState, useEffect } from 'react';
import axios from 'axios';
import { validateForm, createFormData } from './utils';

export const useTrackForm = (navigate, user, authLoading) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    music: null,
    coverImage: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = createFormData(formData);

      const response = await axios.post(`${process.env.VITE_MUSIC_API}/api/music/upload`, formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        // Success - redirect to dashboard
        navigate('/artist/dashboard');
        return true;
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Upload failed. Please try again.'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: user && user.fullname ? `${user.fullname.firstName} ${user.fullname.lastName}` : '',
      music: null,
      coverImage: null
    });
    setErrors({});
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    errors,
    setErrors,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};

export const useAudioPreview = () => {
  const [previews, setPreviews] = useState({
    coverImage: null,
    music: null
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  const handleFileChange = (e, formData, setFormData, setErrors) => {
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

  const resetPreviews = () => {
    setPreviews({
      coverImage: null,
      music: null
    });
    setIsPlaying(false);
    setAudioRef(null);
  };

  return {
    previews,
    setPreviews,
    isPlaying,
    setIsPlaying,
    audioRef,
    setAudioRef,
    handleFileChange,
    toggleAudioPlayback,
    resetPreviews
  };
};
