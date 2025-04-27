import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('Quiz API', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/quiz-test');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    it('должен отдавать страны для квиза', async () => {
        const res = await request(app)
            .post('/api/quiz/start')
            .send({ count: 5 });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
