import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  console.log("Socket.io server is running");

  io.on("connection", (socket) => {
    console.log(`${socket.id} is connected`);

    io.on("disconnect", () => {
      console.log(`${socket.id} is disconnected`);
    });
  });
}

export function getIo() {
  if (!io) {
    throw new Error("socket.io is not initialized");
  }

  return io;
}
