import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import AudioControls from './AudioControls';
import VolumeControls from './VolumeControls';
import ProgressBar from './ProgressBar';
import FullscreenPlayer from './FullscreenPlayer';
import RegularPlayer from './RegularPlayer';

export default function MusicPlayer({ 
  currentSong, 
  onNext, 
  onPrevious, 
  playlist = [], 
  isPlaying, 
  onTogglePlay, 
  onStop 
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const seekTimeoutRef = useRef(null);

  // Handle song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
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
    }
  }, [currentSong, isPlaying]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle loop state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
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

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
  };

  const handleEnded = () => {
    if (isLoop) {
      // Loop current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.error('Error looping audio:', err);
        });
      }
    } else if (onNext) {
      // Go to next song
      onNext();
    }
  };

  // Memoize derived values to avoid unnecessary re-renders
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  const formatTime = useMemo(() => {
    return (time) => {
      if (isNaN(time)) return '0:00';
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closePlayer = () => {
    setShowPlayer(false);
    if (onStop) {
      onStop();
    }
  };

  if (!currentSong || !showPlayer) {
    return null;
  }

  if (isFullscreen) {
    return (
      <FullscreenPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        isLoop={isLoop}
        isLoading={isLoading}
        currentTime={currentTime}
        duration={duration}
        progressPercentage={progressPercentage}
        formatTime={formatTime}
        onTogglePlay={togglePlay}
        onPrevious={onPrevious}
        onNext={onNext}
        onToggleLoop={toggleLoop}
        onSeek={handleSeek}
        onToggleFullscreen={toggleFullscreen}
        onClosePlayer={closePlayer}
        audioRef={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
      />
    );
  }

  return (
    <RegularPlayer
      currentSong={currentSong}
      playlist={playlist}
      isPlaying={isPlaying}
      isLoop={isLoop}
      currentTime={currentTime}
      duration={duration}
      progressPercentage={progressPercentage}
      volume={volume}
      isMuted={isMuted}
      formatTime={formatTime}
      onTogglePlay={togglePlay}
      onPrevious={onPrevious}
      onNext={onNext}
      onToggleLoop={toggleLoop}
      onSeek={handleSeek}
      onVolumeChange={handleVolumeChange}
      onMuteClick={handleMuteClick}
      onClosePlayer={closePlayer}
      onToggleFullscreen={toggleFullscreen}
      audioRef={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      onCanPlay={handleCanPlay}
      onLoadStart={handleLoadStart}
    />
  );
}