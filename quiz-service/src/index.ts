import { config } from "./config";
import mongoose from "mongoose";
import app from "./app";

mongoose
  .connect(config.mongoUri)
  .then(() => console.log("✅ MongoDB connected (quiz-service)"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.listen(config.port, () => {
  console.log(
    `🧠 Quiz Service is running on http://localhost:${config.port}/api/quiz`,
  );
});
