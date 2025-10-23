import { useEffect } from 'react';
import AudioControls from './AudioControls';
import VolumeControls from './VolumeControls';
import ProgressBar from './ProgressBar';
import FullscreenPlayer from './FullscreenPlayer';
import RegularPlayer from './RegularPlayer';
import { useAudioPlayer, usePlayerControls, useVolumeControls, useTimeFormatter } from './hooks';
import { setupVisibilityHandlers, setupFullscreenHandlers } from './utils';

export default function MusicPlayer({
  currentSong,
  onNext,
  onPrevious,
  playlist = [],
  isPlaying,
  onTogglePlay,
  onStop
}) {
  const { formatTime } = useTimeFormatter();

  const {
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
  } = useAudioPlayer(currentSong, isPlaying);

  const {
    isLoop,
    isMuted,
    isFullscreen,
    showPlayer,
    togglePlay,
    toggleLoop,
    handleMuteClick,
    toggleFullscreen,
    closePlayer
  } = usePlayerControls(onTogglePlay, onNext, onStop);

  const {
    volume,
    handleVolumeChange
  } = useVolumeControls();

  // Setup event handlers for visibility and fullscreen changes
  useEffect(() => {
    const cleanupVisibility = setupVisibilityHandlers(audioRef, isPlaying);
    const cleanupFullscreen = setupFullscreenHandlers(audioRef, isPlaying);

    return () => {
      cleanupVisibility?.();
      cleanupFullscreen?.();
    };
  }, [audioRef, isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  // Handle loop state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop, audioRef]);

  if (!currentSong || !showPlayer) {
    return null;
  }

  return (
    <div className="relative">
      {/* Single Audio Element - Shared between both players */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        style={{ display: 'none' }}
      />

      {isFullscreen ? (
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
        />
      ) : (
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
        />
      )}
    </div>
  );
}