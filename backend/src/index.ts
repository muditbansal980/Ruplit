import "dotenv/config";

import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Allow requests from the frontend (configurable via .env)
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
