import { Router } from "express";
import geoData from "../../geojson/geojson.json";

type GeoFeature = {
  type: string;
  properties: {
    adm0_a3: string;
    name: string;
    [key: string]: any;
  };
  geometry: any;
};

type GeoJSONData = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

const data: GeoJSONData = geoData as GeoJSONData;

const router = Router();

router.get("/countries", (_req, res) => {
  res.json(geoData);
});

router.get("/country/:code", (req, res) => {
  const code = req.params.code.toUpperCase();
  const feature = data.features.find((f) => f.properties.adm0_a3 === code);

  if (feature) {
    res.json(feature);
  } else {
    res.status(404).json({ error: `Country with code ${code} not found.` });
  }
});

export default router;
