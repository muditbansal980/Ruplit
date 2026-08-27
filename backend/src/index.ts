import "dotenv/config";

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { validateEnv } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Validate environment variables on boot
validateEnv();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes via req.app
app.set("io", io);

// Allow requests from the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// All API routes
app.use("/api", apiRoutes);

// Global error handler
app.use(errorHandler);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Team members join their role room
  socket.on("join:team", (teamMemberId: string) => {
    socket.join("team");
    console.log(`[Socket.io] Team member ${teamMemberId} joined team room`);
  });

  // Admin joins admin room
  socket.on("join:admin", () => {
    socket.join("admin");
    console.log(`[Socket.io] Admin joined admin room`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Export io for use in other modules
export { io };

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
});
