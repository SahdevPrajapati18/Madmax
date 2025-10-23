export default function SubmitSection({ errors, isSubmitting, onBackToDashboard }) {
  return (
    <>
      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-500 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-black font-bold px-8 py-4 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Upload Track</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
