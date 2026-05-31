import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
});

const aboutSchema = new mongoose.Schema({
  heading: { type: String, default: 'Crafting Unforgettable Journeys for the Modern Soul.' },
  description: { type: String, default: '' },
  images: [{ type: String }],
  teamMembers: [teamMemberSchema],
  companyInfo: {
    founded: String,
    travelers: String,
    destinations: String,
  },
  philosophyCards: [{
    icon: String,
    title: String,
    text: String,
  }],
}, { timestamps: true });

export default mongoose.model('About', aboutSchema);
