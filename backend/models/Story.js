import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  authorName: { type: String, default: '' },
  price: { type: String, default: '' },
  stats: [{
    label: String,
    value: String,
  }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Story', storySchema);
