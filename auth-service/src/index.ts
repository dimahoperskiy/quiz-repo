import express from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth';
import mongoose from 'mongoose';

mongoose
    .connect(config.mongoUri)
    .then(() => console.log('✅ Connected to MongoDB (auth-service)'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(config.port, () => {
    console.log(`🔐 Auth Service running on http://localhost:${config.port}`);
});
