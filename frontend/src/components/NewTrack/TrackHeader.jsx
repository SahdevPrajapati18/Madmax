export default function TrackHeader({ onBackToDashboard }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Upload New Track</h1>
      <p className="text-gray-400 text-lg">Share your music with the world</p>
    </div>
  );
}
