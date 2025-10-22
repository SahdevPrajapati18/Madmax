import { uploadFile, getPresignedUrl } from '../services/storage.service.js';
import musicModel from '../models/music.model.js';
import playlistModel from '../models/playlist.model.js';
import mongoose from 'mongoose';


export async function uploadMusic(req, res){
    const musciFile = req.files['music'][0];
    const coverImageFile = req.files['coverImage'][0];

    try{
        const musicKey = await uploadFile(musciFile);
        const coverImageKey = await uploadFile(coverImageFile);

        const music = await musicModel.create({
            title: req.body.title,
            artist: `${req.user.fullname.firstName + ' ' + req.user.fullname.lastName}`,
            artistId: req.user.id,
            musicKey,
            coverImageKey,
        })

        return res.status(201).json({message: 'Music uploaded successfully', music});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}

export async function getArtistMusic(req, res){
    try{
        let musics = await musicModel.find({artistId: req.user.id}).lean();

        // If no songs for this artist, show all songs (for demo purposes)
        if (musics.length === 0) {
            console.log('No songs found for this artist, showing all songs...');
            musics = await musicModel.find().lean();

            // If still no songs, add sample songs
            if (musics.length === 0) {
                const sampleSongs = [
                    {
                        title: "Midnight Dreams",
                        artist: "Alex Rivera",
                        artistId: req.user.id,
                        musicKey: "sample-midnight-dreams",
                        coverImageKey: "sample-midnight-cover"
                    },
                    {
                        title: "Electric Nights",
                        artist: "Sarah Chen",
                        artistId: req.user.id,
                        musicKey: "sample-electric-nights",
                        coverImageKey: "sample-electric-cover"
                    }
                ];

                await musicModel.insertMany(sampleSongs);
                musics = await musicModel.find({artistId: req.user.id}).lean();
                console.log(`Added ${sampleSongs.length} sample songs for artist`);
            }
        }

        for(let music of musics){
            try {
                music.musicUrl = await getPresignedUrl(music.musicKey);
                music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
            } catch (error) {
                // Fallback URLs for sample songs or when storage fails
                music.musicUrl = `https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3`;
                music.coverImageUrl = `https://picsum.photos/400/400?random=${music._id}`;
            }
        }

        return res.status(200).json({musics});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}

export async function createPlaylist(req, res){
    const { title, description, musics, isPublic, tags } = req.body || {};

    if (!title || !musics || musics.length === 0) {
        return res.status(400).json({ message: 'Missing title or musics in request body' });
    }

    try {
        // Calculate total duration and track count
        let totalDuration = 0;
        let trackCount = musics.length;

        for (const musicId of musics) {
            const music = await musicModel.findById(musicId);
            if (music && music.duration) {
                totalDuration += music.duration;
            }
        }

        const playlist = await playlistModel.create({
            title,
            description: description || '',
            artist: req.user.fullname.firstName + ' ' + req.user.fullname.lastName,
            artistId: req.user.id,
            userId: req.user.id, // For now, user and artist are the same
            musics,
            isPublic: isPublic || false,
            tags: tags || [],
            duration: totalDuration,
            trackCount
        });

        return res.status(201).json({
            message: 'Playlist created successfully',
            playlist: {
                id: playlist._id,
                title: playlist.title,
                description: playlist.description,
                trackCount: playlist.trackCount,
                duration: playlist.duration,
                createdAt: playlist.createdAt
            }
        });
    } catch (err) {
        console.error('Error creating playlist:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function getPlaylists(req, res){
    try{
        const playlists = await playlistModel.find({userId: req.user.id})
            .sort({ createdAt: -1 })
            .lean();

        // Enhance playlists with music details
        for (let playlist of playlists) {
            playlist.id = playlist._id;
            playlist.musics = await Promise.all(
                playlist.musics.map(async (musicId) => {
                    try {
                        const music = await musicModel.findById(musicId).lean();
                        if (music) {
                            music.musicUrl = await getPresignedUrl(music.musicKey);
                            music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
                            return music;
                        }
                        return null;
                    } catch (error) {
                        return null;
                    }
                })
            );
            playlist.musics = playlist.musics.filter(music => music !== null);
        }

        return res.status(200).json({playlists});
    }catch(err){
        console.error('Error fetching playlists:', err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}

export async function getAllMusics(req, res){
    const {skip=0, limit=10} = req.query;
    try{
        // First try to connect and check database
        await musicModel.findOne(); // Test database connection
        let musics = await musicModel.find().skip(skip).limit(limit).lean();

        // If no songs in database, add sample songs
        if (musics.length === 0) {
            console.log('No songs found in database, adding sample songs...');

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
            console.log(`Added ${sampleSongs.length} sample songs to database`);
        }

        for(let music of musics){
            try {
                music.musicUrl = await getPresignedUrl(music.musicKey);
                music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
            } catch (error) {
                music.musicUrl = `https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3`;
                music.coverImageUrl = `https://picsum.photos/400/400?random=${music._id}`;
            }
        }

        return res.status(200).json({musics});
    }catch(err){
        console.error('Database error:', err);
        return res.status(500).json({message: 'Database connection error', error: err.message});
    }
}

export async function getMusicDetails(req, res){
    const {id} = req.params;
    try{
        const music = await musicModel.findById(id).lean();
        if(!music){
            return res.status(404).json({message: 'Music not found'});
        }

        // Get presigned URLs for music and cover image
        try {
            music.musicUrl = await getPresignedUrl(music.musicKey);
            music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
        } catch (error) {
            // Fallback URLs if storage fails
            music.musicUrl = `https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3`;
            music.coverImageUrl = `https://picsum.photos/400/400?random=${music._id}`;
        }

        return res.status(200).json({music});
    }
    catch(err){
        console.error('Error getting music details:', err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}

export async function getPlaylistById(req, res){
    const {id} = req.params;

    try{
        const playlist = await playlistModel.findOne({
            _id: id,
            $or: [
                { userId: req.user.id }, // User owns the playlist
                { isPublic: true } // Or it's a public playlist
            ]
        }).lean();

        if(!playlist){
            return res.status(404).json({message: 'Playlist not found or access denied'});
        }

        // Enhance playlist with music details
        const musics = [];
        for(let musicId of playlist.musics){
            try {
                const music = await musicModel.findById(musicId).lean();
                if(music){
                    music.musicUrl = await getPresignedUrl(music.musicKey);
                    music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
                    musics.push(music);
                }
            } catch (error) {
                console.error('Error getting music details:', error);
            }
        }

        playlist.musics = musics;
        playlist.id = playlist._id;

        return res.status(200).json({playlist});
    }catch(err){
        console.error('Error fetching playlist:', err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}

export async function updatePlaylist(req, res){
    const {id} = req.params;
    const { title, description, musics, isPublic, tags } = req.body || {};

    try{
        // Check if playlist exists and user owns it
        const existingPlaylist = await playlistModel.findOne({
            _id: id,
            userId: req.user.id
        });

        if(!existingPlaylist){
            return res.status(404).json({message: 'Playlist not found or access denied'});
        }

        // Calculate new duration and track count if musics are being updated
        let totalDuration = existingPlaylist.duration;
        let trackCount = existingPlaylist.trackCount;

        if (musics && musics.length > 0) {
            totalDuration = 0;
            trackCount = musics.length;

            for (const musicId of musics) {
                const music = await musicModel.findById(musicId);
                if (music && music.duration) {
                    totalDuration += music.duration;
                }
            }
        }

        // Update playlist
        const updatedPlaylist = await playlistModel.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(musics && { musics }),
                ...(isPublic !== undefined && { isPublic }),
                ...(tags && { tags }),
                duration: totalDuration,
                trackCount
            },
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
                updatedAt: updatedPlaylist.updatedAt
            }
        });
    } catch (err) {
        console.error('Error updating playlist:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function deletePlaylist(req, res){
    const {id} = req.params;

    try{
        // Check if playlist exists and user owns it
        const playlist = await playlistModel.findOne({
            _id: id,
            userId: req.user.id
        });

        if(!playlist){
            return res.status(404).json({message: 'Playlist not found or access denied'});
        }

        await playlistModel.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        console.error('Error deleting playlist:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function addToPlaylist(req, res){
    const {id} = req.params;
    const { musicId } = req.body || {};

    if (!musicId) {
        return res.status(400).json({ message: 'Missing musicId in request body' });
    }

    try{
        // Check if playlist exists and user owns it
        const playlist = await playlistModel.findOne({
            _id: id,
            userId: req.user.id
        });

        if(!playlist){
            return res.status(404).json({message: 'Playlist not found or access denied'});
        }

        // Check if music already exists in playlist
        if (playlist.musics.includes(musicId)) {
            return res.status(400).json({ message: 'Music already exists in playlist' });
        }

        // Add music to playlist
        playlist.musics.push(musicId);
        playlist.trackCount = playlist.musics.length;

        // Update duration
        const music = await musicModel.findById(musicId);
        if (music && music.duration) {
            playlist.duration += music.duration;
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
        console.error('Error adding to playlist:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function removeFromPlaylist(req, res){
    const {id} = req.params;
    const { musicId } = req.body || {};

    if (!musicId) {
        return res.status(400).json({ message: 'Missing musicId in request body' });
    }

    try{
        // Check if playlist exists and user owns it
        const playlist = await playlistModel.findOne({
            _id: id,
            userId: req.user.id
        });

        if(!playlist){
            return res.status(404).json({message: 'Playlist not found or access denied'});
        }

        // Check if music exists in playlist
        const musicIndex = playlist.musics.indexOf(musicId);
        if (musicIndex === -1) {
            return res.status(400).json({ message: 'Music not found in playlist' });
        }

        // Remove music from playlist
        playlist.musics.splice(musicIndex, 1);
        playlist.trackCount = playlist.musics.length;

        // Update duration
        const music = await musicModel.findById(musicId);
        if (music && music.duration) {
            playlist.duration -= music.duration;
        }

        await playlist.save();

        return res.status(200).json({
            message: 'Music removed from playlist successfully',
            playlist: {
                id: playlist._id,
                title: playlist.title,
                trackCount: playlist.trackCount,
                duration: playlist.duration
            }
        });
    } catch (err) {
        console.error('Error removing from playlist:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function getPublicPlaylists(req, res){
    try{
        const playlists = await playlistModel.find({ isPublic: true })
            .sort({ plays: -1, createdAt: -1 })
            .limit(20)
            .lean();

        // Enhance playlists with basic info (without full music details for performance)
        for (let playlist of playlists) {
            playlist.id = playlist._id;
            playlist.trackCount = playlist.musics.length;
        }

        return res.status(200).json({playlists});
    }catch(err){
        console.error('Error fetching public playlists:', err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}
