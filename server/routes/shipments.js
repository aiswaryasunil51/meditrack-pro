import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 🟢 Mock data
const shipments = [
  { id: 1, orderId: 'ORD-001', drug: 'Paracetamol', supplier: 'MediLife', quantity: 500, status: 'delivered', date: '2025-11-01' },
  { id: 2, orderId: 'ORD-002', drug: 'Amoxicillin', supplier: 'PharmaCorp', quantity: 300, status: 'in-transit', date: '2025-11-05' },
  { id: 3, orderId: 'ORD-003', drug: 'Metformin', supplier: 'DiabeCare', quantity: 400, status: 'pending', date: '2025-11-07' }
];

// 🚚 GET all shipments
router.get('/', (req, res) => {
  res.json(shipments);
});

export default router;
