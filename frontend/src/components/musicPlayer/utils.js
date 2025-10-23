// Event handlers for visibility and fullscreen changes
export const setupVisibilityHandlers = (audioRef, isPlaying) => {
  const handleVisibilityChange = () => {
    if (!document.hidden && audioRef.current && isPlaying) {
      // Resume playback when tab becomes visible
      audioRef.current.play().catch(err => {
        console.log('Audio play interrupted when tab visible:', err);
      });
    }
  };

  const handleFocus = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(err => {
        console.log('Audio play interrupted on focus:', err);
      });
    }
  };

  const handleBlur = () => {
    // Don't interfere with pause state on blur
    // Let the audio continue playing in background
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(err => {
        console.log('Audio play interrupted on blur:', err);
      });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleBlur);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('blur', handleBlur);
  };
};

export const setupFullscreenHandlers = (audioRef, isPlaying) => {
  const handleFullscreenChange = () => {
    if (audioRef.current && isPlaying) {
      // Ensure audio continues playing when full screen state changes
      audioRef.current.play().catch(err => {
        console.log('Audio play interrupted by full screen change:', err);
        // If play fails, try again after a short delay
        setTimeout(() => {
          if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(err => {
              console.log('Retry audio play failed:', err);
            });
          }
        }, 100);
      });
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
  };
};

// Audio utility functions
export const formatTime = (time) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const calculateProgressPercentage = (currentTime, duration) => {
  return duration > 0 ? (currentTime / duration) * 100 : 0;
};
