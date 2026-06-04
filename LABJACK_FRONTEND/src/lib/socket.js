// src/lib/socket.js
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_BASE;

export const socket = io(API, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});
