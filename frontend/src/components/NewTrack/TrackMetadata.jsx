export default function TrackMetadata({ formData, errors, authLoading, onInputChange }) {
  return (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
          Track Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
            errors.title ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Enter your track title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Artist Name */}
      <div>
        <label htmlFor="artist" className="block text-sm font-semibold text-white mb-2">
          Artist Name
        </label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={authLoading ? 'Loading...' : formData.artist}
          readOnly
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-not-allowed"
          placeholder={authLoading ? "Loading artist name..." : "Artist name from profile"}
        />
        <p className="text-gray-400 text-xs mt-1">
          {authLoading ? 'Loading profile...' : 'Auto-filled from your profile'}
        </p>
      </div>
    </>
  );
}
