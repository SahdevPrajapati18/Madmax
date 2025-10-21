import { uploadFile, getPresignedUrl } from '../services/storage.service.js';
import musicModel from '../models/music.model.js';
import playlistModel from '../models/playlist.model.js';


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
        const musics = await musicModel.find({artistId: req.user.id}).lean();

        
        
        for(let music of musics){
            music.musicUrl = await getPresignedUrl(music.musicKey);
            music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
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
        const musics = await musicModel.find().skip(skip).limit(limit).lean();      

        for(let music of musics){
            music.musicUrl = await getPresignedUrl(music.musicKey);
            music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
        }

        return res.status(200).json({message:"Musics fetched successfully", musics});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error', error: err.message});
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
