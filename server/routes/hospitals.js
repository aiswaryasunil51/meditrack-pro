import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


// 🟢 Mock data
const hospitals = [
  { id: 1, name: 'Apollo Hospital', location: 'Delhi', consumption: 1250, orders: 28 },
  { id: 2, name: 'Max Healthcare', location: 'Mumbai', consumption: 980, orders: 22 },
  { id: 3, name: 'Fortis Hospital', location: 'Bangalore', consumption: 1100, orders: 25 },
  { id: 4, name: 'AIIMS', location: 'Delhi', consumption: 1450, orders: 32 }
];

// 🏥 GET all hospitals
router.get('/', (req, res) => {
  res.json(hospitals);
});

// 🏥 GET hospital by ID
router.get('/:id', (req, res) => {
  const hospital = hospitals.find(h => h.id === parseInt(req.params.id));
  hospital ? res.json(hospital) : res.status(404).json({ message: 'Hospital not found' });
});

export default router;
