import { useState, useRef, useEffect } from 'react';

export default function MusicPlayer({ currentSong, onNext, onPrevious, playlist = [], isPlaying, onTogglePlay, onStop }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.musicUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleEnded = () => {
    if (onNext) {
      onNext();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  if (!currentSong || !showPlayer) {
    return null;
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={currentSong.coverImageUrl}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover shadow-lg"
            />
            <div>
              <div className="text-white text-lg font-medium truncate">{currentSong.title}</div>
              <div className="text-gray-400 text-sm truncate">{currentSong.artist}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors touch-target"
              title="Exit fullscreen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-6H4v2h3v1H5v0zm3-8H5v2h3v1H4v2h6V7H8v1zm6 11h2v-3h3v-2h-6v6h1v-1zm2-11V5h-2v6h6V9h-3V8h-1z"/>
              </svg>
            </button>
            <button
              onClick={closePlayer}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors touch-target"
              title="Close player"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Fullscreen Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Large Album Art */}
          <div className="mb-8">
            <img
              src={currentSong.coverImageUrl}
              alt={currentSong.title}
              className="w-80 h-80 sm:w-96 sm:h-96 rounded-2xl object-cover shadow-2xl"
            />
          </div>

          {/* Song Info */}
          <div className="text-center mb-8 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400">{currentSong.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-400 text-sm min-w-[2.5rem] text-center">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider touch-target"
              />
              <span className="text-gray-400 text-sm min-w-[2.5rem] text-center">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              className={`p-3 touch-target rounded-full transition-colors ${
                onPrevious ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 cursor-not-allowed'
              }`}
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/>
              </svg>
            </button>

            <button
              className="bg-white text-black rounded-full p-4 hover:scale-105 transition-all shadow-lg touch-target"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
                </svg>
              )}
            </button>

            <button
              className={`p-3 touch-target rounded-full transition-colors ${
                onNext ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 cursor-not-allowed'
              }`}
              onClick={onNext}
              disabled={!onNext}
            >
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 z-50 flex items-center px-3 sm:px-4 mobile-transition">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-3 sm:gap-4">
        {/* Song Info - Mobile optimized */}
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:w-80">
          <img
            src={currentSong.coverImageUrl}
            alt={currentSong.title}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-lg"
          />
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm sm:text-base font-medium truncate leading-tight">{currentSong.title}</div>
            <div className="text-gray-400 text-xs sm:text-sm truncate hover:text-white cursor-pointer transition-colors">
              {currentSong.artist}
            </div>
            {playlist.length <= 1 && (
              <div className="text-green-500 text-xs mt-0.5">
                Single Song Mode
              </div>
            )}
          </div>
        </div>

        {/* Player Controls - Mobile first */}
        <div className="flex flex-col items-center flex-1 max-w-sm sm:max-w-lg">
          {/* Control buttons */}
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <button
              className={`p-2 touch-target rounded-full transition-colors ${
                onPrevious ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 cursor-not-allowed'
              }`}
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/>
              </svg>
            </button>

            <button
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-all touch-target shadow-lg"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
                </svg>
              )}
            </button>

            <button
              className={`p-2 touch-target rounded-full transition-colors ${
                onNext ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 cursor-not-allowed'
              }`}
              onClick={onNext}
              disabled={!onNext}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/>
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 w-full px-2">
            <span className="text-gray-400 text-xs min-w-[2.5rem] text-center">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider touch-target"
            />
            <span className="text-gray-400 text-xs min-w-[2.5rem] text-center">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Controls - Mobile responsive */}
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:w-80 justify-end">
          <button className="text-gray-400 hover:text-white p-2 touch-target rounded-full transition-colors" onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"/>
                <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"/>
              </svg>
            ) : volume < 0.5 ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"/>
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider touch-target hidden sm:block"
          />

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors touch-target"
            title="Fullscreen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={closePlayer}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors touch-target"
            title="Close player"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
