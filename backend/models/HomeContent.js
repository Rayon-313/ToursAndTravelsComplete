import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
  heroHeading: { type: String, default: 'Experience The Magic' },
  heroSubtext: { type: String, default: 'Immerse yourself in breathtaking journeys' },
  bannerImages: [{ type: String }],
  offerText: { type: String, default: 'GET 20% OFF Book Now' },
  sections: {
    trendingHeading: { type: String, default: 'Trending Destinations' },
    chooseHeading: { type: String, default: 'Choose Your Destinations' },
    galleryHeading: { type: String, default: 'Adventure Awaits' },
  },
}, { timestamps: true });

export default mongoose.model('HomeContent', homeContentSchema);
