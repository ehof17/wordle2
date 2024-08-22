import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "wordle.5x5-wordle.com";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "http://localhost:3000" : "https://wordle.5x5-wordle.com",
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", (socket) => {
    const connectionTime = new Date().toISOString();
    console.log(`Connection made:`);
    console.log(`  Socket ID: ${socket.id}`);
    console.log(`  Connection Time: ${connectionTime}`);
    console.log(`  Handshake Details: ${JSON.stringify(socket.handshake, null, 2)}`);

    socket.on("disconnect", (reason) => {
      const disconnectionTime = new Date().toISOString();
      console.log(`Disconnection:`);
      console.log(`  Socket ID: ${socket.id}`);
      console.log(`  Disconnection Time: ${disconnectionTime}`);
      console.log(`  Reason: ${reason}`);
    });
  });


  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});