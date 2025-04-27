import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

describe('Auth API', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/auth-test');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase(); // 💣 чистим тестовую БД после тестов
        await mongoose.disconnect();
    });

    it('должен регистрировать нового пользователя', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: `testuser_${Date.now()}@example.com`,
                password: '123456',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Пользователь зарегестрирован');
    });
});
