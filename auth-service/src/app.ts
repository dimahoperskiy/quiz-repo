import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import { metricsEndpoint } from "./metrics";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/metrics", metricsEndpoint);

export default app;
