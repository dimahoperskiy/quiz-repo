import { Router } from 'express';
import geoData = require('../../geojson.json');

type GeoFeature = {
    type: string;
    properties: {
        adm0_a3: string; // код страны (например, "CRI")
        name: string;    // имя страны
        [key: string]: any;
    };
    geometry: any;
};

type GeoJSONData = {
    type: 'FeatureCollection';
    features: GeoFeature[];
};

const data: GeoJSONData = geoData as GeoJSONData;

const router = Router();

// GET /api/countries → весь geojson
router.get('/countries', (_req, res) => {
    res.json(geoData);
});

// GET /api/country/:code → одна страна по ISO_A3 (например, "CRI")
router.get('/country/:code', (req, res) => {
    const code = req.params.code.toUpperCase();
    const feature = data.features.find(
        (f: any) => f.properties.adm0_a3 === code
    );

    if (feature) {
        res.json(feature);
    } else {
        res.status(404).json({ error: `Country with code ${code} not found.` });
    }
});

export default router;
