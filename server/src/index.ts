import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import memoryRoutes from './routes/memoryRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { ensurePredefinedOwnerAccount } from './controllers/authController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static file serving for user uploads (audio, photos, drawings)
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', authRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'active', app: 'MYSELF Digital Emotional Diary' });
});

app.listen(PORT, async () => {
  console.log(`✨ MYSELF Server running gently on port ${PORT}`);
  await ensurePredefinedOwnerAccount();
});
