import express from 'express';
import quizRoutes from './routes/quiz';
import { config } from './config';
import cors from 'cors';
import mongoose from 'mongoose';

mongoose
    .connect(config.mongoUri)
    .then(() => console.log('✅ MongoDB connected (quiz-service)'))
    .catch((err) => console.error('❌ MongoDB error:', err));


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/quiz', quizRoutes);

app.listen(config.port, () => {
    console.log(`🧠 Quiz Service is running on http://localhost:${config.port}/api/quiz`);
});
