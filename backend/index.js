import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze.js';
import emailRoutes from './routes/email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/analyze', analyzeRoutes);
app.use('/api/email', emailRoutes);

// Global error handler — never leak stack traces in production
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: IS_PROD ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} (${IS_PROD ? 'production' : 'development'})`);
});
