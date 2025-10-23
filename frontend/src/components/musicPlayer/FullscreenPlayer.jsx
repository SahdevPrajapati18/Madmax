import React from 'react';
import AudioControls from './AudioControls';
import VolumeControls from './VolumeControls';
import ProgressBar from './ProgressBar';
import Logo from '../Logo';

export default function FullscreenPlayer({
  currentSong,
  isPlaying,
  isLoop,
  isLoading,
  currentTime,
  duration,
  progressPercentage,
  formatTime,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleLoop,
  onSeek,
  onToggleFullscreen,
  onClosePlayer,
  audioRef,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onCanPlay,
  onLoadStart,
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-950 z-[9999] 
      flex flex-col text-white overflow-hidden">
      {/* Audio element removed - now handled in parent MusicPlayer component */}

      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Logo */}
          <Logo size="small" className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity" />

          <img
            src={currentSong.coverImageUrl}
            alt={currentSong.title}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
              {currentSong.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-400 truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Exit Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-gray-800 transition active:scale-95"
            title="Exit fullscreen"
            aria-label="Exit fullscreen"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16h3v3h2v-6H4v2h1zm3-8H5v2h3v1H4v2h6V7H8v1zm6 11h2v-3h3v-2h-6v6h1v-1zm2-11V5h-2v6h6V9h-3V8h-1z" />
            </svg>
          </button>

          {/* Close Player */}
          <button
            onClick={onClosePlayer}
            className="p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-gray-800 transition active:scale-95"
            title="Close player"
            aria-label="Close player"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
        {/* Album Art */}
        <div className="relative mb-6 sm:mb-8 md:mb-10 lg:mb-12 transition-transform duration-500 ease-out hover:scale-105">
          <img
            src={currentSong.coverImageUrl}
            alt={currentSong.title}
            className="w-50 h-50 rounded-2xl sm:rounded-3xl object-cover shadow-2xl"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl sm:rounded-3xl flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-4 border-gray-300/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-4 max-w-xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
            {currentSong.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400">
            {currentSong.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xl md:max-w-xl mb-4 sm:mb-6 md:mb-8">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            progressPercentage={progressPercentage}
            onSeek={onSeek}
            formatTime={formatTime}
            size="fullscreen"
          />
        </div>

        {/* Controls */}
        <div className="w-full max-w-sm md:max-w-md">
          <AudioControls
            onPrevious={onPrevious}
            onNext={onNext}
            onTogglePlay={onTogglePlay}
            onToggleLoop={onToggleLoop}
            isPlaying={isPlaying}
            isLoop={isLoop}
            size="fullscreen"
          />
        </div>
      </div>

      {/* Optional Background Glow */}
      <div
        className="absolute inset-0 -z-10 opacity-20 sm:opacity-25 md:opacity-30"
        style={{
          backgroundImage: `url(${currentSong.coverImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px) saturate(150%)',
        }}
      />
    </div>
  );
}