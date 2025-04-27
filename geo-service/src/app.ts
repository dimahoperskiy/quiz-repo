import express, { Application } from "express";
import cors from "cors";
import geoRoutes from "./routes/geo";

const app: Application = express();

app.use(cors());
app.use("/api", geoRoutes);

export default app;
