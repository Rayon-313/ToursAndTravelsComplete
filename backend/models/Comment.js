import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
