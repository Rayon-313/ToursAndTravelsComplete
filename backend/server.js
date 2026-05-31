import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import storyRoutes from './routes/stories.js';
import galleryRoutes from './routes/gallery.js';
import commentRoutes from './routes/comments.js';
import filterRoutes from './routes/filters.js';
import aboutRoutes from './routes/about.js';
import contactRoutes from './routes/contact.js';
import homeRoutes from './routes/home.js';
import Admin from './models/Admin.js';
import HomeContent from './models/HomeContent.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aariyana')
  .then(async () => {
    console.log('MongoDB connected');

    const adminExists = await Admin.findOne({ username: 'sahil' });
    if (!adminExists) {
      const admin = new Admin({ username: 'sahil', password: 'sahil3233' });
      await admin.save();
      console.log('Admin user seeded: sahil / sahil3233');
    }

    const homeExists = await HomeContent.findOne();
    if (!homeExists) {
      const home = new HomeContent();
      await home.save();
      console.log('Default home content created');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/home', homeRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
