import express from 'express';
import HomeContent from '../models/HomeContent.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let home = await HomeContent.findOne();
    if (!home) {
      home = new HomeContent();
      await home.save();
    }
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', authenticateToken, upload.array('bannerImages', 10), async (req, res) => {
  try {
    let home = await HomeContent.findOne();
    if (!home) { home = new HomeContent(); }
    const data = JSON.parse(req.body.data || '{}');
    Object.assign(home, data);
    if (req.files?.length) {
      home.bannerImages = req.files.map(f => '/uploads/' + f.filename);
    }
    await home.save();
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
