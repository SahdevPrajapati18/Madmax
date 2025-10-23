import { useState } from 'react';
import { formatNumber, isSongOwner } from './utils';

export default function TrackList({
  artistSongs,
  loading,
  currentSong,
  currentIndex,
  onPlaySong,
  editingSong,
  editForm,
  setEditForm,
  showDeleteConfirm,
  setShowDeleteConfirm,
  onEditSong,
  onSaveEdit,
  onDeleteSong,
  onCancelEdit
}) {
  const [localEditForm, setLocalEditForm] = useState(editForm);

  const handleEditSong = (song) => {
    setLocalEditForm({
      title: song.title || '',
      artist: song.artist || '',
      duration: song.duration || '3:24'
    });
    onEditSong(song);
  };

  const handleSaveEdit = async () => {
    setEditForm(localEditForm);
    const success = await onSaveEdit();
    if (success) {
      setLocalEditForm({ title: '', artist: '', duration: '' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading songs...</p>
        </div>
      ) : artistSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-lg">No songs available</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Plays</div>
            <div className="col-span-2">Duration</div>
          </div>

          <div className="divide-y divide-gray-700">
            {artistSongs.map((song, index) => (
              <div
                key={song._id || index}
                className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-700 transition-colors cursor-pointer group ${
                  currentSong?._id === song._id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="col-span-1 flex items-center justify-center text-gray-400 text-sm">
                  {currentSong?._id === song._id ? (
                    <div className="flex gap-0.5 items-end h-4">
                      <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="w-0.5 h-4 bg-green-500 rounded-full animate-pulse delay-150"></span>
                      <span className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse delay-300"></span>
                    </div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <img
                    src={song.coverImageUrl || 'https://via.placeholder.com/40x40?text=No+Image'}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium text-sm truncate">{song.title || 'Unknown Title'}</div>
                  </div>
                </div>

                <div className="col-span-3 flex items-center text-gray-400 text-sm">
                  {formatNumber(song.plays || 0)}
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <span className="text-gray-400 text-sm">{song.duration || '3:24'}</span>

                  {/* Edit and Delete buttons - only show for song owner */}
                  {isSongOwner(song) && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-8 h-8 bg-gray-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSong(song);
                        }}
                        title="Edit song"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        className="w-8 h-8 bg-gray-600 hover:bg-red-500 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(song._id);
                        }}
                        title="Delete song"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Play button */}
                  <button
                    className="w-8 h-8 bg-transparent hover:bg-green-500 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => onPlaySong(song, index)}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Song Modal */}
      {editingSong && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-white text-lg font-bold mb-4">Edit Song</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Title</label>
                <input
                  type="text"
                  value={localEditForm.title}
                  onChange={(e) => setLocalEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Artist</label>
                <input
                  type="text"
                  value={localEditForm.artist}
                  onChange={(e) => setLocalEditForm(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Duration</label>
                <input
                  type="text"
                  value={localEditForm.duration}
                  onChange={(e) => setLocalEditForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-green-500 focus:outline-none"
                  placeholder="3:24"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={onCancelEdit}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-white text-lg font-bold mb-4">Delete Song</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this song? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onDeleteSong(showDeleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
