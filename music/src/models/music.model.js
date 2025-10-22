import mongoose from "mongoose";


const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    artistId:{
        type: mongoose.Schema.Types.ObjectId,

    },
    musicKey: {
        type: String,
        required: true
    },
    coverImageKey: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0 // in seconds
    },
    plays: {
        type: Number,
        default: 0
    },
    releaseDate: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const music = mongoose.model('music', musicSchema);

export default music;