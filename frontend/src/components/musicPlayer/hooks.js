import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export const useAudioPlayer = (currentSong, isPlaying) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const seekTimeoutRef = useRef(null);

  // Handle song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      const currentSrc = audioRef.current.src;

      // Only reset and reload if it's actually a different song
      if (currentSrc !== currentSong.musicUrl) {
        // Pause current audio and reset state
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        // Set new source and load
        audioRef.current.src = currentSong.musicUrl;
        audioRef.current.load();

        // Auto-play if was playing
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      } else if (isPlaying) {
        // Same song, just ensure it's playing
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    }
  }, [currentSong, isPlaying]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Ensure audio continues from current position
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      } else {
        // Just pause - don't reset currentTime
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      // Only update state if there's a significant time difference
      // to avoid unnecessary re-renders
      const audioTime = audioRef.current.currentTime;
      const timeDiff = Math.abs(audioTime - currentTime);

      if (timeDiff > 0.1) {
        setCurrentTime(audioTime);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Debounced seek function for smoother experience
  const handleSeek = useCallback((e) => {
    // Clear previous timeout
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }

    // Set new timeout for debounced seek
    seekTimeoutRef.current = setTimeout(() => {
      const seekTime = (e.target.value / 100) * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }, 100); // 100ms debounce delay

    // Update current time immediately for responsive UI
    const immediateSeekTime = (e.target.value / 100) * duration;
    setCurrentTime(immediateSeekTime);
  }, [duration]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  // Memoize derived values
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  return {
    audioRef,
    currentTime,
    duration,
    progressPercentage,
    isLoading,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleCanPlay,
    handleLoadStart,
    handleEnded,
    handleSeek
  };
};

export const usePlayerControls = (onTogglePlay, onNext, onStop) => {
  const [isLoop, setIsLoop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  const togglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    }
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closePlayer = () => {
    setShowPlayer(false);
    if (onStop) {
      onStop();
    }
  };

  return {
    isLoop,
    isMuted,
    isFullscreen,
    showPlayer,
    togglePlay,
    toggleLoop,
    handleMuteClick,
    toggleFullscreen,
    closePlayer
  };
};

export const useVolumeControls = () => {
  const [volume, setVolume] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
  };

  return {
    volume,
    handleVolumeChange
  };
};

export const useTimeFormatter = () => {
  const formatTime = useMemo(() => {
    return (time) => {
      if (isNaN(time)) return '0:00';
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
  }, []);

  return { formatTime };
};
