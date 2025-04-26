import { Router } from 'express';
import axios from 'axios';
import { config } from '../config';
import {authMiddleware} from "../middleware/auth";
import { Result } from '../models/Result';



const router = Router();

router.post('/start', async (req, res) => {
    const { count } = req.body;
    try {
        const geoRes = await axios.get(`${config.geoServiceUrl}/countries`);
        const features = geoRes.data.features;

        const shuffled = features.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count).map((f: any) => ({
            name: f.properties.name_ru,
            code: f.properties.adm0_a3,
        }));

        res.json(selected);
    } catch (error) {
        console.error('GeoService error:', error);
        res.status(500).json({ error: 'GeoService unavailable' });
    }
});

router.post(
    '/submit',
    authMiddleware(config.jwtSecret),
    async (req, res) => {
        const { answers, total, correct } = req.body;
        const userId = (req as unknown as Request & { userId?: string }).userId;


        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!Array.isArray(answers) || typeof total !== 'number' || typeof correct !== 'number') {
            res.status(400).json({ error: 'Invalid payload' });
            return;
        }

        try {
            await Result.create({
                userId,
                total,
                correct,
                answers,
            });

            res.json({ message: 'Результаты сохранены' });
        } catch (e) {
            console.error('❌ Ошибка сохранения:', e);
            res.status(500).json({ error: 'Ошибка при сохранении результата' });
        }
    }
);


router.get(
    '/stats',
    authMiddleware(config.jwtSecret),
    async (req, res) => {
        const userId = (req as unknown as Request & { userId?: string }).userId;

        try {
            const results = await Result.find({ userId }).sort({ createdAt: -1 });

            res.json(results);
        } catch (e) {
            console.error('❌ Ошибка при получении статистики:', e);
            res.status(500).json({ error: 'Ошибка при загрузке статистики' });
        }

        return;
    }
);

export default router;
