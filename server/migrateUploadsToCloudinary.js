import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import cloudinary from './config/cloudinary.js'; // your cloudinary config
import dotenv from 'dotenv';
import posts from './models/postModel.js';

dotenv.config();

// ------------------- CONFIG -------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db';
const UPLOADS_FOLDER = path.join(process.cwd(), 'uploads'); // adjust if different

// ------------------- MONGOOSE -------------------
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// ------------------- MIGRATION -------------------
const migrateImages = async () => {
  try {
    const files = fs.readdirSync(UPLOADS_FOLDER);

    for (const file of files) {
      const localPath = path.join(UPLOADS_FOLDER, file);

      console.log('Uploading:', localPath);

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'posts',
      });

      console.log('Uploaded to Cloudinary URL:', result.secure_url);

      // Update corresponding posts in DB
      const updated = await posts.updateMany(
        { image: { $regex: file } }, // find posts using this local file
        { $set: { image: result.secure_url } }
      );

      console.log(`Updated ${updated.modifiedCount} post(s) in DB`);

      // Delete local file
      fs.unlinkSync(localPath);
      console.log('Deleted local file:', localPath);
    }

    console.log('Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

// Run migration
migrateImages();
