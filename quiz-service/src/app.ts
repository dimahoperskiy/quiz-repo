import express, { Application } from "express";
import cors from "cors";
import quizRoutes from "./routes/quiz";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/quiz", quizRoutes);

export default app;
