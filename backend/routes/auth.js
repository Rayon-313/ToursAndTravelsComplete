import express from 'express';
import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    let admin = await Admin.findOne({ username });
    if (!admin) {
      admin = new Admin({ username, password });
      await admin.save();
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin);
    res.json({ token, admin: { username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ valid: false });
    }
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'aariyana-secret-key-2024';
    const decoded = jwt.default.verify(token, JWT_SECRET);
    res.json({ valid: true, admin: { username: decoded.username } });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
