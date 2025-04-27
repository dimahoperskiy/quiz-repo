import mongoose from "mongoose";
import { config } from "./config";
import app from "./app";

mongoose
  .connect(config.mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(config.port, () => {
  console.log(`🚀 Auth Service running on port ${config.port}`);
});
