import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
});

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  duration: { type: String, default: '' },
  maxPeople: { type: String, default: '' },
  languages: { type: String, default: '' },
  location: { type: String, default: '' },
  price: { type: String, default: '' },
  priceValue: { type: Number, default: 0 },
  rating: { type: String, default: '4.9' },
  difficulty: { type: String, default: '' },
  category: { type: String, default: '' },
  destinationType: { type: String, enum: ['normal', 'trek'], default: 'normal' },
  region: { type: String, default: '' },
  mainImage: { type: String, default: '' },
  cardImage: { type: String, default: '' },
  itinerary: [itinerarySchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Destination', destinationSchema);
