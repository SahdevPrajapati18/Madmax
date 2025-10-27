import { uploadFile, getPresignedUrl, deleteFile } from '../services/storage.service.js';
import musicModel from '../models/music.model.js';
import playlistModel from '../models/playlist.model.js';
import mongoose from 'mongoose';

// ==================== HELPER FUNCTIONS ====================

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Generate presigned URLs with fallback
async function getUrlsWithFallback(music) {
  try {
    music.musicUrl = await getPresignedUrl(music.musicKey);
    music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
  } catch (error) {
    console.error(`Failed to generate URLs for music ${music._id}:`, error);
    music.musicUrl = `https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3`;
    music.coverImageUrl = `https://picsum.photos/400/400?random=${music._id}`;
  }
  return music;
}

// Validate authentication middleware helper
function validateAuth(req, res) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'User not authenticated' });
    return false;
  }
  return true;
}

// ==================== MUSIC ENDPOINTS ====================

// ------------------------ Upload Music ------------------------
export async function uploadMusic(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    // Validate file uploads
    if (!req.files || !req.files['music'] || !req.files['coverImage']) {
      return res.status(400).json({ 
        message: 'Missing required files. Both music and cover image are required.' 
      });
    }

    const musicFile = req.files['music'][0];
    const coverImageFile = req.files['coverImage'][0];

    // Validate required fields
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Upload files
    const musicKey = await uploadFile(musicFile);
    const coverImageKey = await uploadFile(coverImageFile);

    // Create music record
    const music = await musicModel.create({
      title: req.body.title.trim(),
      artist: `${req.user.fullname.firstName} ${req.user.fullname.lastName}`,
      artistId: req.user.id,
      musicKey,
      coverImageKey,
    });

    return res.status(201).json({ 
      message: 'Music uploaded successfully', 
      music 
    });
  } catch (err) {
    console.error('Upload music error:', err);
    return res.status(500).json({ 
      message: 'Failed to upload music', 
      error: err.message 
    });
  }
}

// ------------------------ Get Artist Music ------------------------
export async function getArtistMusic(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    let musics = await musicModel.find({ artistId: req.user.id }).lean();

    // If no songs for this artist, show all songs (for demo)
    if (musics.length === 0) {
      musics = await musicModel.find().lean();
      
      // Create sample data only if database is completely empty
      if (musics.length === 0) {
        const sampleSongs = [
          { 
            title: "Midnight Dreams", 
            artist: "Alex Rivera", 
            artistId: new mongoose.Types.ObjectId(), 
            musicKey: "sample-midnight-dreams", 
            coverImageKey: "sample-midnight-cover" 
          },
          { 
            title: "Electric Nights", 
            artist: "Sarah Chen", 
            artistId: new mongoose.Types.ObjectId(), 
            musicKey: "sample-electric-nights", 
            coverImageKey: "sample-electric-cover" 
          }
        ];
        await musicModel.insertMany(sampleSongs);
        musics = await musicModel.find().lean();
      }
    }

    // Generate URLs in parallel
    await Promise.all(musics.map(music => getUrlsWithFallback(music)));

    return res.status(200).json({ musics });
  } catch (err) {
    console.error('Get artist music error:', err);
    return res.status(500).json({ 
      message: 'Failed to retrieve music', 
      error: err.message 
    });
  }
}

// ------------------------ Get All Musics ------------------------
export async function getAllMusics(req, res) {
  try {
    // Parse and validate pagination
    const skip = Math.max(0, parseInt(req.query.skip) || 0);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    let musics = await musicModel.find().skip(skip).limit(limit).lean();

    // Create sample data only if database is empty and not paginated
    if (musics.length === 0 && skip === 0) {
      const sampleSongs = [
        { 
          title: "Midnight Dreams", 
          artist: "Alex Rivera", 
          artistId: new mongoose.Types.ObjectId(), 
          musicKey: "sample-midnight-dreams", 
          coverImageKey: "sample-midnight-cover" 
        },
        { 
          title: "Electric Nights", 
          artist: "Sarah Chen", 
          artistId: new mongoose.Types.ObjectId(), 
          musicKey: "sample-electric-nights", 
          coverImageKey: "sample-electric-cover" 
        },
        { 
          title: "Neon Lights", 
          artist: "Marcus Johnson", 
          artistId: new mongoose.Types.ObjectId(), 
          musicKey: "sample-neon-lights", 
          coverImageKey: "sample-neon-cover" 
        },
        { 
          title: "Ocean Waves", 
          artist: "Luna Martinez", 
          artistId: new mongoose.Types.ObjectId(), 
          musicKey: "sample-ocean-waves", 
          coverImageKey: "sample-ocean-cover" 
        },
        { 
          title: "City Lights", 
          artist: "David Kim", 
          artistId: new mongoose.Types.ObjectId(), 
          musicKey: "sample-city-lights", 
          coverImageKey: "sample-city-cover" 
        }
      ];
      await musicModel.insertMany(sampleSongs);
      musics = await musicModel.find().skip(skip).limit(limit).lean();
    }

    // Generate URLs in parallel
    await Promise.all(musics.map(music => getUrlsWithFallback(music)));

    return res.status(200).json({ 
      musics,
      pagination: { skip, limit, count: musics.length }
    });
  } catch (err) {
    console.error('Get all musics error:', err);
    return res.status(500).json({ 
      message: 'Failed to retrieve music', 
      error: err.message 
    });
  }
}

// ------------------------ Get Music Details ------------------------
export async function getMusicDetails(req, res) {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid music ID format' });
    }

    const music = await musicModel.findById(id).lean();
    
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }

    await getUrlsWithFallback(music);

    return res.status(200).json({ music });
  } catch (err) {
    console.error('Get music details error:', err);
    return res.status(500).json({ 
      message: 'Failed to retrieve music details', 
      error: err.message 
    });
  }
}

// ------------------------ Delete Music ------------------------
export async function deleteMusic(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid music ID format' });
    }

    // Find the music track and verify ownership
    const music = await musicModel.findOne({
      _id: id,
      artistId: req.user.id
    });

    if (!music) {
      return res.status(404).json({
        message: 'Music not found or access denied'
      });
    }

    // Delete files from Supabase storage
    try {
      await Promise.all([
        deleteFile(music.musicKey),
        deleteFile(music.coverImageKey)
      ]);
    } catch (storageError) {
      console.error('Error deleting files from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await musicModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Music deleted successfully'
    });
  } catch (err) {
    console.error('Delete music error:', err);
    return res.status(500).json({
      message: 'Failed to delete music',
      error: err.message
    });
  }
}

// ==================== PLAYLIST ENDPOINTS ====================

// ------------------------ Create Playlist ------------------------
export async function createPlaylist(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { title, description, musics, isPublic, tags } = req.body || {};

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!musics || !Array.isArray(musics) || musics.length === 0) {
      return res.status(400).json({ 
        message: 'At least one music track is required' 
      });
    }

    // Validate all music IDs
    const invalidIds = musics.filter(id => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid music IDs provided',
        invalidIds 
      });
    }

    // Fetch all music tracks in one query (avoid N+1 problem)
    const musicTracks = await musicModel.find({ _id: { $in: musics } }).lean();

    if (musicTracks.length !== musics.length) {
      return res.status(400).json({ 
        message: 'Some music tracks not found',
        found: musicTracks.length,
        requested: musics.length
      });
    }

    // Calculate total duration
    const totalDuration = musicTracks.reduce((sum, music) => {
      return sum + (music.duration || 0);
    }, 0);

    // Get cover image from first song
    let coverImageUrl = null;
    if (musicTracks.length > 0) {
      const firstMusic = musicTracks[0];
      try {
        coverImageUrl = await getPresignedUrl(firstMusic.coverImageKey);
      } catch {
        coverImageUrl = `https://picsum.photos/400/400?random=${firstMusic._id}`;
      }
    }

    // Create playlist
    const playlist = await playlistModel.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      artist: `${req.user.fullname.firstName} ${req.user.fullname.lastName}`,
      artistId: req.user.id,
      userId: req.user.id,
      musics,
      isPublic: Boolean(isPublic),
      coverImageUrl,
      tags: Array.isArray(tags) ? tags : [],
      duration: totalDuration,
      trackCount: musics.length
    });

    return res.status(201).json({
      message: 'Playlist created successfully',
      playlist: {
        id: playlist._id,
        title: playlist.title,
        description: playlist.description,
        trackCount: playlist.trackCount,
        duration: playlist.duration,
        coverImageUrl: playlist.coverImageUrl,
        createdAt: playlist.createdAt
      }
    });
  } catch (err) {
    console.error('Create playlist error:', err);
    return res.status(500).json({ 
      message: 'Failed to create playlist', 
      error: err.message 
    });
  }
}

// ------------------------ Get User's Playlists ------------------------
export async function getPlaylists(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const playlists = await playlistModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get all unique music IDs from all playlists
    const allMusicIds = [...new Set(playlists.flatMap(p => p.musics))];

    // Fetch all music tracks in one query (avoid N+1 problem)
    const allMusics = await musicModel.find({ _id: { $in: allMusicIds } }).lean();
    
    // Generate URLs in parallel
    await Promise.all(allMusics.map(music => getUrlsWithFallback(music)));

    // Create a map for quick lookup
    const musicMap = new Map(allMusics.map(m => [m._id.toString(), m]));

    // Populate playlists with music data
    for (let playlist of playlists) {
      playlist.id = playlist._id;
      playlist.musics = playlist.musics
        .map(musicId => musicMap.get(musicId.toString()))
        .filter(m => m !== undefined);
    }

    return res.status(200).json({ playlists });
  } catch (err) {
    console.error('Get playlists error:', err);
    return res.status(500).json({ 
      message: 'Failed to retrieve playlists', 
      error: err.message 
    });
  }
}

// ------------------------ Get Public Playlists ------------------------
export async function getPublicPlaylists(req, res) {
  try {
    const playlists = await playlistModel
      .find({ isPublic: true })
      .sort({ plays: -1, createdAt: -1 })
      .limit(20)
      .lean();

    // Add basic info without fetching all music details (performance optimization)
    for (let playlist of playlists) {
      playlist.id = playlist._id;
      playlist.trackCount = playlist.musics.length;
    }

    return res.status(200).json({ playlists });
  } catch (err) {
    console.error('Get public playlists error:', err);
    return res.status(500).json({ 
      message: 'Failed to retrieve public playlists', 
      error: err.message 
    });
  }
}

// ------------------------ Get Playlist by ID ------------------------
export async function getPlaylistById(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID format' });
    }

    const playlist = await playlistModel.findOne({
      _id: id,
      $or: [{ userId: req.user.id }, { isPublic: true }]
    }).lean();

    if (!playlist) {
      return res.status(404).json({ 
        message: 'Playlist not found or access denied' 
      });
    }

    // Fetch all music tracks in one query
    const musics = await musicModel.find({ _id: { $in: playlist.musics } }).lean();
    
    // Generate URLs in parallel
    await Promise.all(musics.map(music => getUrlsWithFallback(music)));

    // Create ordered list based on playlist order
    const musicMap = new Map(musics.map(m => [m._id.toString(), m]));
    playlist.musics = playlist.musics
      .map(musicId => musicMap.get(musicId.toString()))
      .filter(m => m !== undefined);

    playlist.id = playlist._id;

    return res.status(200).json({ playlist });
  } catch (err) {
    console.error('Get playlist by ID error:', err);
    return res.status(500).json({ 
      message: 'Failed to retrieve playlist', 
      error: err.message 
    });
  }
}

// ------------------------ Add Music to Playlist ------------------------
export async function addToPlaylist(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { id } = req.params;
    const { musicId } = req.body || {};

    // Validate playlist ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID format' });
    }

    // Validate music ID
    if (!musicId || !isValidObjectId(musicId)) {
      return res.status(400).json({ message: 'Valid musicId is required' });
    }

    const playlist = await playlistModel.findOne({ 
      _id: id, 
      userId: req.user.id 
    });
    
    if (!playlist) {
      return res.status(404).json({ 
        message: 'Playlist not found or access denied' 
      });
    }

    // Check if music already exists (FIXED: convert ObjectIds to strings)
    const musicExists = playlist.musics.some(m => m.toString() === musicId);
    if (musicExists) {
      return res.status(400).json({ 
        message: 'Music already exists in playlist' 
      });
    }

    // Verify music track exists
    const music = await musicModel.findById(musicId);
    if (!music) {
      return res.status(404).json({ message: 'Music track not found' });
    }

    const isFirstSong = playlist.musics.length === 0;
    let coverImageUrl = playlist.coverImageUrl;

    // Update cover image if first song
    if (isFirstSong) {
      try {
        coverImageUrl = await getPresignedUrl(music.coverImageKey);
      } catch {
        coverImageUrl = `https://picsum.photos/400/400?random=${music._id}`;
      }
    }

    // Update playlist
    playlist.musics.push(musicId);
    playlist.trackCount = playlist.musics.length;
    playlist.duration = (playlist.duration || 0) + (music.duration || 0);
    
    if (isFirstSong) {
      playlist.coverImageUrl = coverImageUrl;
    }

    await playlist.save();

    return res.status(200).json({
      message: 'Music added to playlist successfully',
      playlist: { 
        id: playlist._id, 
        title: playlist.title, 
        trackCount: playlist.trackCount, 
        duration: playlist.duration 
      }
    });
  } catch (err) {
    console.error('Add to playlist error:', err);
    return res.status(500).json({ 
      message: 'Failed to add music to playlist', 
      error: err.message 
    });
  }
}

// ------------------------ Remove Music from Playlist ------------------------
export async function removeFromPlaylist(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { id } = req.params;
    const { musicId } = req.body || {};

    // Validate playlist ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID format' });
    }

    // Validate music ID
    if (!musicId || !isValidObjectId(musicId)) {
      return res.status(400).json({ message: 'Valid musicId is required' });
    }

    const playlist = await playlistModel.findOne({ 
      _id: id, 
      userId: req.user.id 
    });
    
    if (!playlist) {
      return res.status(404).json({ 
        message: 'Playlist not found or access denied' 
      });
    }

    // FIXED: Find index using string comparison for ObjectIds
    const musicIndex = playlist.musics.findIndex(m => m.toString() === musicId);
    
    if (musicIndex === -1) {
      return res.status(400).json({ 
        message: 'Music not found in playlist' 
      });
    }

    const isFirstSong = musicIndex === 0;
    let coverImageUrl = playlist.coverImageUrl;

    // Update cover image if removing first song
    if (isFirstSong && playlist.musics.length > 1) {
      const newFirstMusic = await musicModel.findById(playlist.musics[1]);
      if (newFirstMusic) {
        try {
          coverImageUrl = await getPresignedUrl(newFirstMusic.coverImageKey);
        } catch {
          coverImageUrl = `https://picsum.photos/400/400?random=${newFirstMusic._id}`;
        }
      }
    } else if (isFirstSong && playlist.musics.length === 1) {
      coverImageUrl = null;
    }

    // Get music duration before removing
    const music = await musicModel.findById(musicId);
    const musicDuration = music?.duration || 0;

    // Update playlist
    playlist.musics.splice(musicIndex, 1);
    playlist.trackCount = playlist.musics.length;
    playlist.duration = Math.max(0, (playlist.duration || 0) - musicDuration);
    
    if (isFirstSong) {
      playlist.coverImageUrl = coverImageUrl;
    }

    await playlist.save();

    return res.status(200).json({
      message: 'Music removed from playlist successfully',
      playlist: { 
        id: playlist._id, 
        title: playlist.title, 
        trackCount: playlist.trackCount, 
        duration: playlist.duration, 
        coverImageUrl: playlist.coverImageUrl 
      }
    });
  } catch (err) {
    console.error('Remove from playlist error:', err);
    return res.status(500).json({ 
      message: 'Failed to remove music from playlist', 
      error: err.message 
    });
  }
}

// ------------------------ Update Playlist ------------------------
export async function updatePlaylist(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { id } = req.params;
    const { title, description, musics, isPublic, tags } = req.body || {};

    // Validate playlist ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID format' });
    }

    // Check if playlist exists and user owns it
    const existingPlaylist = await playlistModel.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!existingPlaylist) {
      return res.status(404).json({ 
        message: 'Playlist not found or access denied' 
      });
    }

    let totalDuration = existingPlaylist.duration;
    let trackCount = existingPlaylist.trackCount;
    let coverImageUrl = existingPlaylist.coverImageUrl;

    // If musics are being updated
    if (musics && Array.isArray(musics)) {
      if (musics.length === 0) {
        return res.status(400).json({ 
          message: 'Playlist must contain at least one track' 
        });
      }

      // Validate all music IDs
      const invalidIds = musics.filter(musicId => !isValidObjectId(musicId));
      if (invalidIds.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid music IDs provided',
          invalidIds 
        });
      }

      // Fetch all music tracks in one query
      const musicTracks = await musicModel.find({ _id: { $in: musics } }).lean();

      if (musicTracks.length !== musics.length) {
        return res.status(400).json({ 
          message: 'Some music tracks not found',
          found: musicTracks.length,
          requested: musics.length
        });
      }

      // Calculate new duration
      totalDuration = musicTracks.reduce((sum, music) => {
        return sum + (music.duration || 0);
      }, 0);
      trackCount = musics.length;

      // FIXED: Update cover image if first song changed (compare as strings)
      const firstMusicChanged = musics[0] !== existingPlaylist.musics[0]?.toString();
      if (firstMusicChanged) {
        const firstMusic = musicTracks.find(m => m._id.toString() === musics[0]);
        if (firstMusic) {
          try {
            coverImageUrl = await getPresignedUrl(firstMusic.coverImageKey);
          } catch {
            coverImageUrl = `https://picsum.photos/400/400?random=${firstMusic._id}`;
          }
        }
      }
    }

    // Build update object
    const updateData = {
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(musics && { musics }),
      ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
      ...(tags && Array.isArray(tags) && { tags }),
      duration: totalDuration,
      trackCount,
      coverImageUrl
    };

    const updatedPlaylist = await playlistModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Playlist updated successfully',
      playlist: {
        id: updatedPlaylist._id,
        title: updatedPlaylist.title,
        description: updatedPlaylist.description,
        trackCount: updatedPlaylist.trackCount,
        duration: updatedPlaylist.duration,
        coverImageUrl: updatedPlaylist.coverImageUrl
      }
    });
  } catch (err) {
    console.error('Update playlist error:', err);
    return res.status(500).json({ 
      message: 'Failed to update playlist', 
      error: err.message 
    });
  }
}

// ------------------------ Delete Playlist ------------------------
export async function deletePlaylist(req, res) {
  try {
    // Validate authentication
    if (!validateAuth(req, res)) return;

    const { id } = req.params;

    // Validate playlist ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID format' });
    }

    // Check if playlist exists and user owns it
    const playlist = await playlistModel.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!playlist) {
      return res.status(404).json({ 
        message: 'Playlist not found or access denied' 
      });
    }

    return res.status(200).json({ 
      message: 'Playlist deleted successfully' 
    });
  } catch (err) {
    console.error('Delete playlist error:', err);
    return res.status(500).json({ 
      message: 'Failed to delete playlist', 
      error: err.message 
    });
  }
}