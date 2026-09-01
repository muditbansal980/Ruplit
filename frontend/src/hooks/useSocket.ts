"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, role, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);

      // Join appropriate room based on role
      if (role === "TEAM" && user?.id) {
        socket.emit("join:team", user.id);
      } else if (role === "ADMIN") {
        socket.emit("join:admin");
      }
    });

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, role, user?.id]);

  return socketRef;
}
