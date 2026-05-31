import express from 'express';
import Destination from '../models/Destination.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, region, search } = req.query;
    let query = {};
    if (type) query.destinationType = type;
    if (region) query.region = { $regex: region, $options: 'i' };
    if (search) query.title = { $regex: search, $options: 'i' };
    query.status = 'active';
    const destinations = await Destination.find(query).sort({ order: 1, createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ order: 1, createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateToken, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'cardImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const destination = new Destination(data);
    if (req.files?.mainImage) {
      destination.mainImage = '/uploads/' + req.files.mainImage[0].filename;
    }
    if (req.files?.cardImage) {
      destination.cardImage = '/uploads/' + req.files.cardImage[0].filename;
    }
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticateToken, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'cardImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    Object.assign(destination, data);
    if (req.files?.mainImage) {
      destination.mainImage = '/uploads/' + req.files.mainImage[0].filename;
    }
    if (req.files?.cardImage) {
      destination.cardImage = '/uploads/' + req.files.cardImage[0].filename;
    }
    await destination.save();
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
