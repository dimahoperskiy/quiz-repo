import express from 'express';
import geoRoutes from './routes/geo';
import { config } from './config';

import cors from 'cors';

const app = express();
app.use(cors());

app.use('/api', geoRoutes);

app.listen(config.port, () => {
    console.log(`🌍 Geo Service is running on http://localhost:${config.port}/api`);
});
