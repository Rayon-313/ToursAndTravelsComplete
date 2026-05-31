import express from 'express';
import About from '../models/About.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({
        heading: 'Crafting Unforgettable Journeys for the Modern Soul.',
        description: 'At Aariyana Tours & Travels, we believe travel is more than a change of scenery-it is a transformation of the spirit. Our commitment lies in crafting bespoke, magic travel experiences that resonate with your personal narrative.',
        philosophyCards: [
          { icon: 'diamond', title: 'Curated Excellence', text: 'Every destination and accommodation is hand-selected and rigorously vetted to ensure it meets our exacting standards for beauty, service and authenticity.' },
          { icon: 'compass', title: 'Personalized Journeys', text: 'No two travelers are the same. We design itineraries from a blank canvas, tailored specifically to your curiosities, pace, and lifestyle preferences.' },
          { icon: 'earth', title: 'Global Stewardship', text: 'We are committed to preserving the wonders we showcase. Our journeys support local communities and prioritize eco-friendly practices for a lasting positive impact.' },
        ],
      });
      await about.save();
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) { about = new About(); }
    const data = JSON.parse(req.body.data || '{}');
    Object.assign(about, data);
    if (req.files?.length) {
      about.images = req.files.map(f => '/uploads/' + f.filename);
    }
    await about.save();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
