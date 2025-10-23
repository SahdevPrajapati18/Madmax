import React from 'react';
import AudioControls from './AudioControls';
import ProgressBar from './ProgressBar';
import VolumeControls from './VolumeControls';
import Logo from '../Logo';

export default function RegularPlayer({
  currentSong,
  playlist,
  isPlaying,
  isLoop,
  currentTime,
  duration,
  progressPercentage,
  volume,
  isMuted,
  formatTime,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleLoop,
  onSeek,
  onVolumeChange,
  onMuteClick,
  onClosePlayer,
  onToggleFullscreen,
  audioRef,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onCanPlay,
  onLoadStart
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 z-50 
      h-[72px] sm:h-20 md:h-24 lg:h-28
      px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Audio element removed - now handled in parent MusicPlayer component */}

      <div className="flex items-center justify-evenly w-full max-w-screen-xl mx-auto h-full gap-2 sm:gap-3 md:gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1  sm:max-w-xs">
          <img
            src={currentSong.coverImageUrl}
            alt={currentSong.title}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 
                rounded-md sm:rounded-lg object-cover shadow-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium truncate">
              {currentSong.title}
            </div>
            <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm truncate hover:text-white cursor-pointer transition-colors">
              {currentSong.artist}
            </div>
            {playlist.length <= 1 && (
              <div className="text-green-500 text-[9px] sm:text-[10px] mt-0.5 hidden sm:block">
                Single Song
              </div>
            )}
          </div>
        </div>

        {/* Player Controls - Center */}
        <div className="flex flex-col items-center justify-center flex-1 gap-1 sm:gap-1.5 md:gap-2 max-w-md lg:max-w-lg">
          <AudioControls
            onPrevious={onPrevious}
            onNext={onNext}
            onTogglePlay={onTogglePlay}
            onToggleLoop={onToggleLoop}
            isPlaying={isPlaying}
            isLoop={isLoop}
            size="regular"
          />
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            progressPercentage={progressPercentage}
            onSeek={onSeek}
            formatTime={formatTime}
            size="regular"
          />
        </div>

        {/* Right Section - Volume and Controls */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-end">
          {/* Volume Controls */}
          <VolumeControls
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteClick={onMuteClick}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 
                rounded-full transition-colors active:scale-95"
              title="Enter fullscreen"
              aria-label="Enter fullscreen"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>

            <button
              onClick={onClosePlayer}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 
                rounded-full transition-colors active:scale-95"
              title="Close player"
              aria-label="Close player"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}