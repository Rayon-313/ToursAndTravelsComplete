import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
