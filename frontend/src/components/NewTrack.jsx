import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTrackForm, useAudioPreview } from './NewTrack/hooks';
import TrackHeader from './NewTrack/TrackHeader';
import TrackMetadata from './NewTrack/TrackMetadata';
import CoverImageUpload from './NewTrack/CoverImageUpload';
import AudioUpload from './NewTrack/AudioUpload';
import SubmitSection from './NewTrack/SubmitSection';

export default function NewTrack() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const {
    formData,
    setFormData,
    isSubmitting,
    errors,
    setErrors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useTrackForm(navigate, user, authLoading);

  const {
    previews,
    isPlaying,
    audioRef,
    handleFileChange,
    toggleAudioPlayback,
    resetPreviews
  } = useAudioPreview();

  const onFileChange = (e) => {
    handleFileChange(e, formData, setFormData, setErrors, () => audioRef);
  };

  const handleBackToDashboard = () => {
    navigate('/artist/dashboard');
  };

  const onSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) {
      resetForm();
      resetPreviews();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrackHeader onBackToDashboard={handleBackToDashboard} />

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <TrackMetadata
              formData={formData}
              errors={errors}
              authLoading={authLoading}
              onInputChange={handleInputChange}
            />

            <CoverImageUpload
              preview={previews.coverImage}
              error={errors.coverImage}
              onFileChange={onFileChange}
            />

            <AudioUpload
              preview={previews.music}
              error={errors.music}
              isPlaying={isPlaying}
              onFileChange={onFileChange}
              onTogglePlayback={() => toggleAudioPlayback(audioRef, isPlaying, () => {})}
            />

            <SubmitSection
              errors={errors}
              isSubmitting={isSubmitting}
              onBackToDashboard={handleBackToDashboard}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
