export const filterSongs = (songs, searchQuery, searchType) => {
  if (!searchQuery.trim()) {
    return songs;
  }

  const query = searchQuery.toLowerCase();
  return songs.filter(song => {
    if (searchType === 'song') {
      return song.title?.toLowerCase().includes(query);
    } else {
      return song.artist?.toLowerCase().includes(query);
    }
  });
};

export const handlePlayPlaylist = async (playlist, playSong, playlistService) => {
  try {
    // If playlist has musics, play the first song
    if (playlist.musics && playlist.musics.length > 0) {
      // For now, we'll play the first song in the playlist
      // In a real implementation, you might want to fetch the full playlist data first
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

export const handleArtistClick = (artistId, artistName, navigate) => {
  if (artistId) {
    navigate(`/artist/${artistId}`, { state: { artistName } });
  }
};

// Group songs by artist for the artist search view
export const groupSongsByArtist = (songs) => {
  return songs.reduce((acc, song) => {
    const artist = song.artist || 'Unknown Artist';
    if (!acc[artist]) {
      acc[artist] = {
        name: artist,
        artistId: song.artistId,
        songs: []
      };
    }
    acc[artist].songs.push(song);
    return acc;
  }, {});
};
