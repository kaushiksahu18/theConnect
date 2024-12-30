import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";

import { ExtWebSocket } from "./types";
import { UserManager } from "./managers/UserManager";
import { RoomManager } from "./managers/RoomManager";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const userManager = new UserManager();
const roomManager = new RoomManager();

let usercount = 0;

wss.on("connection", function connection(ws: ExtWebSocket) {
  ws.on("error", console.error);
  ws.id = randomUUID();
  console.log("Connection established");

  userManager.addUser("user" + usercount++, ws);

  ws.on("close", function close() {
    console.log("Connection closed");
    userManager.removeUser(ws.id);
  });
});

// API Endpoints
app.get("/users", (req, res) => {
  console.log(new Date() + "Requesting users");
  res.send(userManager.getUsers());
});

app.get("/rooms", (req, res) => {
  console.log(new Date() + "Requesting rooms");
  res.send(roomManager.getRooms());
});

// Server listening
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
