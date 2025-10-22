import mongoose from 'mongoose';
import musicModel from './src/models/music.model.js';
import connectDB from './src/db/db.js';

// Sample songs data
const sampleSongs = [
  {
    title: "Midnight Dreams",
    artist: "Alex Rivera",
    artistId: new mongoose.Types.ObjectId(),
    musicKey: "sample-audio/midnight-dreams.mp3",
    coverImageKey: "sample-images/midnight-dreams.jpg"
  },
  {
    title: "Electric Nights",
    artist: "Sarah Chen",
    artistId: new mongoose.Types.ObjectId(),
    musicKey: "sample-audio/electric-nights.mp3",
    coverImageKey: "sample-images/electric-nights.jpg"
  },
  {
    title: "Neon Lights",
    artist: "Marcus Johnson",
    artistId: new mongoose.Types.ObjectId(),
    musicKey: "sample-audio/neon-lights.mp3",
    coverImageKey: "sample-images/neon-lights.jpg"
  },
  {
    title: "Ocean Waves",
    artist: "Luna Martinez",
    artistId: new mongoose.Types.ObjectId(),
    musicKey: "sample-audio/ocean-waves.mp3",
    coverImageKey: "sample-images/ocean-waves.jpg"
  },
  {
    title: "City Lights",
    artist: "David Kim",
    artistId: new mongoose.Types.ObjectId(),
    musicKey: "sample-audio/city-lights.mp3",
    coverImageKey: "sample-images/city-lights.jpg"
  },
  {
    title: "Mountain Peak",
    artist: "Emma Thompson",
    artistId: new mongoose.Types.ObjectId(),
    musicKey: "sample-audio/mountain-peak.mp3",
    coverImageKey: "sample-images/mountain-peak.jpg"
  }
];

async function seedSongs() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing songs
    await musicModel.deleteMany({});
    console.log('Cleared existing songs');

    // Add sample songs
    const songs = await musicModel.insertMany(sampleSongs);
    console.log(`Added ${songs.length} sample songs to database`);

    console.log('Sample songs added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding songs:', error);
    process.exit(1);
  }
}

seedSongs();
