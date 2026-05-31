import mongoose from 'mongoose';

const filterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Filter', filterSchema);
