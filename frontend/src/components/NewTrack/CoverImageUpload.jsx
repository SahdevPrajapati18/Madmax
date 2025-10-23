export default function CoverImageUpload({ preview, error, onFileChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        Cover Image *
      </label>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
        <input
          type="file"
          id="coverImage"
          name="coverImage"
          onChange={onFileChange}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
        />
        <label htmlFor="coverImage" className="cursor-pointer">
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Cover preview"
                className="w-48 h-48 object-cover rounded-lg mx-auto"
              />
              <div className="text-center">
                <p className="text-green-500 text-sm mb-2">✓ Image uploaded successfully</p>
                <p className="text-gray-400 text-xs">Click to change image</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">Click to upload cover image</p>
              <p className="text-gray-500 text-xs">JPEG, PNG, WebP (max 10MB)</p>
            </div>
          )}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
