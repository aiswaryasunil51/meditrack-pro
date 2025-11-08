import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';   // ✅ add this line
import authRoutes from './routes/auth.js';
import drugRoutes from './routes/drugs.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// 🧠 Test Database Connection
pool.query('SELECT NOW() AS now')
  .then(([rows]) => console.log('🟢 Database connected! Server time:', rows[0].now))
  .catch(err => console.error('🔴 Database connection failed:', err.message));

// Routes
app.get('/api/health', (_, res) => res.json({ status: 'OK', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/drugs', drugRoutes);

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});
