import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import drugRoutes from './routes/drugs.js';
import supplierRoutes from './routes/suppliers.js';
import hospitalRoutes from './routes/hospitals.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration with YOUR exact frontend URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://meditrack-frontend-aiswarya1.vercel.app', // deployed frontend
    'https://meditrack-frontend-aiswarya1.vercel.app/', // trailing slash safety
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'MediTrack Backend is running' 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/hospitals', hospitalRoutes);

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;
