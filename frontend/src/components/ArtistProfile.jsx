import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MusicPlayer from './musicPlayer/MusicPlayer';
import { useArtistSongs, useMusicPlayer, useSongManagement } from './artistProfile/hooks';
import ArtistHeader from './artistProfile/ArtistHeader';
import TrackList from './artistProfile/TrackList';

export default function ArtistProfile() {
  const { artistId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artistName, setArtistName] = useState(location.state?.artistName || 'Artist');

  const { artistSongs, loading, totalPlays, refetch } = useArtistSongs(artistId);
  const { currentSong, currentIndex, playSong, playNext, playPrevious, playAll, stopMusic } = useMusicPlayer();
  const {
    editingSong,
    editForm,
    setEditForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleEditSong,
    handleSaveEdit,
    handleDeleteSong,
    handleCancelEdit
  } = useSongManagement();

  useEffect(() => {
    // Set artist name from first song if not provided
    if (artistSongs.length > 0 && !location.state?.artistName) {
      setArtistName(artistSongs[0].artist || 'Unknown Artist');
    }
  }, [artistSongs, location.state?.artistName]);

  const handleSongDeleted = async (songId) => {
    const success = await handleDeleteSong(songId);
    if (success) {
      // If the deleted song was currently playing, stop it
      if (currentSong && currentSong._id === songId) {
        stopMusic();
      }
      // Refetch songs to update the list
      refetch();
    } else {
      alert('Failed to delete song. Please try again.');
    }
  };

  const handleSongSaved = async () => {
    const success = await handleSaveEdit();
    if (success) {
      // Refetch songs to update the list
      refetch();
    } else {
      alert('Failed to update song. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => navigate(-1)}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Back
        </button>

        <ArtistHeader
          artistName={artistName}
          totalPlays={totalPlays}
          songCount={artistSongs.length}
          onPlayAll={() => playAll(artistSongs)}
          hasSongs={artistSongs.length > 0}
        />

        <TrackList
          artistSongs={artistSongs}
          loading={loading}
          currentSong={currentSong}
          currentIndex={currentIndex}
          onPlaySong={(song, index) => playSong(song, artistSongs, index)}
          editingSong={editingSong}
          editForm={editForm}
          setEditForm={setEditForm}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          onEditSong={handleEditSong}
          onSaveEdit={handleSongSaved}
          onDeleteSong={handleSongDeleted}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Music Player */}
      {currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          onNext={currentIndex < artistSongs.length - 1 ? () => playNext(artistSongs) : null}
          onPrevious={currentIndex > 0 ? () => playPrevious(artistSongs) : null}
          playlist={artistSongs}
        />
      )}
    </div>
  );
}
