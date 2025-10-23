export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Check if current user is the owner of the song (artist)
export const isSongOwner = (song) => {
  // For security, only allow edit/delete if viewing your own profile
  // In a real app, you'd check song.artistId === currentUser.id
  // For now, we'll disable edit/delete for all public profiles
  return false; // Disable edit/delete for security
};
