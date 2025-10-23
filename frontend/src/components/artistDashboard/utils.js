export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const playNext = (playlist, currentSongIndex, setCurrentSong, setCurrentSongIndex) => {
  if (playlist.length === 0) return;

  const nextIndex = (currentSongIndex + 1) % playlist.length;
  setCurrentSong(playlist[nextIndex]);
  setCurrentSongIndex(nextIndex);
};

export const playPrevious = (playlist, currentSongIndex, setCurrentSong, setCurrentSongIndex) => {
  if (playlist.length === 0) return;

  const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
  setCurrentSong(playlist[prevIndex]);
  setCurrentSongIndex(prevIndex);
};
