export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const handlePlayPlaylist = async (playlist, playSong, playlistService) => {
  try {
    // If playlist has musics, play the first song
    if (playlist.musics && playlist.musics.length > 0) {
      const firstSong = playlist.musics[0];
      if (firstSong && firstSong.musicUrl) {
        playSong(firstSong, playlist.musics, 0);
      } else {
        // If the playlist data doesn't have full music objects, fetch the playlist details first
        const playlistDetails = await playlistService.getPlaylistById(playlist._id || playlist.id);
        if (playlistDetails.playlist && playlistDetails.playlist.musics && playlistDetails.playlist.musics.length > 0) {
          playSong(playlistDetails.playlist.musics[0], playlistDetails.playlist.musics, 0);
        }
      }
    }
  } catch (error) {
    console.error('Error playing playlist:', error);
  }
};
