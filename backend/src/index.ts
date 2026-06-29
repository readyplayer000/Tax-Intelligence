import 'module-alias/register';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import entryRoutes from './routes/entries';
import authRoutes from './routes/auth';
import chatRouter from './routes/chat';

import path from 'path';

// Load .env locally; on Render, env vars are set via dashboard
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback for production

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('<h1>TaxAI Backend is Running</h1><p>Check <a href="/health">/health</a> for status.</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`TaxAI Backend running on http://localhost:${PORT}`);
});
