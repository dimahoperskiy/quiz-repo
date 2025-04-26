import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3002,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/default',
    geoServiceUrl: process.env.GEO_SERVICE_URL || 'http://localhost:3001/api',
    jwtSecret: process.env.JWT_SECRET || 'secret'
};