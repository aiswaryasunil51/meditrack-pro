import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 🟢 Mock data (replace later with DB queries)
const suppliers = [
  { id: 1, name: 'MediLife Pvt Ltd', rating: 4.5, onTimeDelivery: 92, qualityScore: 96, pendingOrders: 3 },
  { id: 2, name: 'PharmaCorp Suppliers', rating: 4.2, onTimeDelivery: 88, qualityScore: 94, pendingOrders: 5 },
  { id: 3, name: 'HealthGen Industries', rating: 4.8, onTimeDelivery: 95, qualityScore: 98, pendingOrders: 1 },
  { id: 4, name: 'DiabeCare Pharma', rating: 4.0, onTimeDelivery: 85, qualityScore: 90, pendingOrders: 4 }
];

// 📦 GET all suppliers
router.get('/', (req, res) => {
  res.json(suppliers);
});

// 📦 GET supplier by ID
router.get('/:id', (req, res) => {
  const supplier = suppliers.find(s => s.id === parseInt(req.params.id));
  supplier ? res.json(supplier) : res.status(404).json({ message: 'Supplier not found' });
});

export default router;
