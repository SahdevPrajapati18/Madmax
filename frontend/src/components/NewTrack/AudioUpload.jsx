export default function AudioUpload({ preview, error, isPlaying, onFileChange, onTogglePlayback }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        Music File *
      </label>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
        <input
          type="file"
          id="music"
          name="music"
          onChange={onFileChange}
          accept="audio/mpeg,audio/wav,audio/mp3,audio/m4a"
          className="hidden"
        />
        <label htmlFor="music" className="cursor-pointer">
          {preview ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={onTogglePlayback}
                  className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                <div className="text-left">
                  <p className="text-white font-medium">{preview.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(preview.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-green-500 text-sm mb-2">✓ Audio uploaded successfully</p>
                <p className="text-gray-400 text-xs">Click to change audio file</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-gray-400">Click to upload music file</p>
              <p className="text-gray-500 text-xs">MP3, WAV, M4A (max 50MB)</p>
            </div>
          )}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
