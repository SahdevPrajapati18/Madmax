import express from 'express';
import multer from 'multer';
import * as musicController from '../controllers/music.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';



const upload = multer({
    storage: multer.memoryStorage(),
});


const router = express.Router();

// POST /api/music/upload
router.post('/upload',authMiddleware.authArtistMiddleware, upload.fields([
    {name: 'music', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]), musicController.uploadMusic)


//GET /api/music/public - Public endpoint for all songs (no auth required)
router.get('/public', musicController.getAllMusics)

//GET /api/music

router.get('/', authMiddleware.authUserMiddleware, musicController.getAllMusics)

// GET /api/music/artist-musics
router.get('/artist-musics', authMiddleware.authArtistMiddleware, musicController.getArtistMusic)


// GET /api/music/music-details/:id
router.get('/music-details/:id', authMiddleware.authUserMiddleware, musicController.getMusicDetails)

// Playlist routes - work for both users and artists
// POST /api/music/playlist
router.post('/playlist', authMiddleware.authUserMiddleware, musicController.createPlaylist)

// GET /api/music/playlists
router.get('/playlists', authMiddleware.authUserMiddleware, musicController.getPlaylists)

// GET /api/music/public-playlists (no auth required for public playlists)
router.get('/public-playlists', musicController.getPublicPlaylists)

//GET /api/music/playlist/:id
router.get('/playlist/:id', authMiddleware.authUserMiddleware, musicController.getPlaylistById)

// PUT /api/music/playlist/:id
router.put('/playlist/:id', authMiddleware.authUserMiddleware, musicController.updatePlaylist)

// DELETE /api/music/playlist/:id
router.delete('/playlist/:id', authMiddleware.authUserMiddleware, musicController.deletePlaylist)

// POST /api/music/playlist/:id/add
router.post('/playlist/:id/add', authMiddleware.authUserMiddleware, musicController.addToPlaylist)

// POST /api/music/playlist/:id/remove
router.post('/playlist/:id/remove', authMiddleware.authUserMiddleware, musicController.removeFromPlaylist)


export default router;