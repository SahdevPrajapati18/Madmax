import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    artist: {
        type: String,
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'music'
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    coverImageUrl: {
        type: String,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    plays: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0 // in seconds
    },
    trackCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
playlistSchema.index({ artistId: 1, createdAt: -1 });
playlistSchema.index({ userId: 1, isPublic: 1 });
playlistSchema.index({ title: 'text', description: 'text' });

const playlist = mongoose.model('playlist', playlistSchema);

export default playlist;