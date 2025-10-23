export const validateForm = (formData) => {
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

  return newErrors;
};

export const handleFileChange = (e, setFormData, setPreviews, setErrors, setAudioRef) => {
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

export const toggleAudioPlayback = (audioRef, isPlaying, setIsPlaying) => {
  if (audioRef) {
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsPlaying(!isPlaying);
  }
};

export const createFormData = (formData) => {
  const formDataToSend = new FormData();
  formDataToSend.append('title', formData.title);
  formDataToSend.append('artist', formData.artist);
  formDataToSend.append('music', formData.music);
  formDataToSend.append('coverImage', formData.coverImage);
  return formDataToSend;
};
