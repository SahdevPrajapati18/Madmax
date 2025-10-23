import { useEffect } from 'react';

export const useKeyboardShortcuts = (onPlayPause, onNext, onPrevious) => {
  useEffect(() => {
    if (!onPlayPause || !onNext || !onPrevious) {
      return;
    }

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when user is typing in input fields
      if (event.target.tagName === 'INPUT' ||
          event.target.tagName === 'TEXTAREA' ||
          event.target.contentEditable === 'true') {
        return;
      }

      // Prevent default behavior for our shortcuts
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onPlayPause();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'KeyN':
          if (event.ctrlKey) {
            event.preventDefault();
            onNext();
          }
          break;
        case 'KeyP':
          if (event.ctrlKey) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case 'MediaPlayPause':
          event.preventDefault();
          onPlayPause();
          break;
        case 'MediaTrackNext':
          event.preventDefault();
          onNext();
          break;
        case 'MediaTrackPrevious':
          event.preventDefault();
          onPrevious();
          break;
        default:
          break;
      }
    };

    // Add event listener to window for global scope
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPlayPause, onNext, onPrevious]);
};
