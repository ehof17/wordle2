"use client";

import { io } from "socket.io-client";
const dev = process.env.NODE_ENV !== "production";
export const socket = io(dev ? "http://localhost:3000" : "https://wordle.5x5-wordle.com", {
    path: "/socket.io" // Ensure the correct path is used
  });