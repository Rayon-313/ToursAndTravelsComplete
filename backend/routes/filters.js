import express from 'express';
import Filter from '../models/Filter.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = await Filter.find().sort({ name: 1 });
    res.json(filters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, options } = req.body;
    if (!name) return res.status(400).json({ message: 'Filter name required' });
    const filter = new Filter({ name, options: options || [] });
    await filter.save();
    res.status(201).json(filter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const filter = await Filter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!filter) return res.status(404).json({ message: 'Filter not found' });
    res.json(filter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const filter = await Filter.findByIdAndDelete(req.params.id);
    if (!filter) return res.status(404).json({ message: 'Filter not found' });
    res.json({ message: 'Filter deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
