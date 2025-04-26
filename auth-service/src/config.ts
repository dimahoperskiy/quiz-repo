import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3003,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/default',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
};
