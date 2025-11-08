import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, c.category_name, m.name AS manufacturer
      FROM drugs d
      LEFT JOIN drug_categories c ON d.category_id = c.category_id
      LEFT JOIN manufacturers m ON d.manufacturer_id = m.manufacturer_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
