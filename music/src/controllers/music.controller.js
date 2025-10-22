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
    const { title, musics } = req.body || {};
    if (!title || !musics) {
        return res.status(400).json({ message: 'Missing title or musics in request body' });
    }

    try {
        const playlist = await playlistModel.create({
            artist: req.user.fullname.firstName + ' ' + req.user.fullname.lastName,
            artistId: req.user.id,
            title,
            userId: req.user.id,
            musics
        });
        return res.status(201).json({ message: 'Playlist created successfully', playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function getPlaylists(req, res){
    try{
        const playlists = await playlistModel.find({artistId: req.user.id}).lean();
        return res.status(200).json({playlists});
    }catch(err){
        console.log(err);
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

export async function getPlaylistById(req, res){
    const {id} = req.params;

    try{
        const playlist = await playlistModel.findById(id).lean();
        if(!playlist){
            return res.status(404).json({message: 'Playlist not found'});
        }

        const musics=[]

        for(let musicId of playlist.musics){
            const music = await musicModel.findById(musicId).lean();
            if(music){
                music.musicUrl = await getPresignedUrl(music.musicKey);
                music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
                musics.push(music);
            }
        }
        
        playlist.musics = musics;

        return res.status(200).json({playlist});
    }catch(err){
        console.error(err)
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}
    
export async function getMusicDetails(req, res){
    const {id} = req.params;
    try{
        const music = await musicModel.findById(id).lean();
        if(!music){
            return res.status(404).json({message: 'Music not found'});
        }
        music.musicUrl = await getPresignedUrl(music.musicKey);
        music.coverImageUrl = await getPresignedUrl(music.coverImageKey);

        return res.status(200).json({music});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
    }
}
