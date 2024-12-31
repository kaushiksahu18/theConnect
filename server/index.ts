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

wss.on("connection", (ws: ExtWebSocket) => {
  ws.on("error", (err) => {
    console.log(new Date() + "\t" + err);
    return;
  });

  ws.id = randomUUID();
  console.log(new Date() + "\tConnection established");

  userManager.addUser("user" + usercount++, ws);

  try {
    ws.on("message", (message: string) => {
      const response = JSON.parse(message);

      if (response.name) {
        userManager.updateName(ws.id, response.name);
      }

      switch (response.type) {
        case "createRoom": {
          console.log(new Date() + ws.id + "\tCreating room");
          const roomID = roomManager.startNewRoom(
            userManager.getUserById(ws.id)!
          );
          ws.send(
            JSON.stringify({
              status: "Room created",
              roomID,
              isPaired: false,
            })
          );
          break;
        }
        case "joinRoom": {
          console.log(new Date() + ws.id + "\tJoining room");
          const room = roomManager.getRoombyId(response.roomID);
          if (room) {
            const roomID = roomManager.createRoom(
              room.id,
              userManager.getUserById(ws.id)!
            );
            ws.send(
              JSON.stringify({
                status: "Room Joined",
                roomID,
                isPaired: true,
              })
            );
          } else {
            ws.send("Room not found");
          }
          break;
        }
        case "sendMessage": {
          const room = roomManager.getRoombyId(response.roomID)!;
          const sender = userManager.getUserById(ws.id)!;
          const reciver = room.user1 === sender ? room.user2 : room.user1;

          console.log(
            new Date() + sender.name + "\tSending message to " + reciver.name
          );
          
          if (sender.isPaired && reciver.isPaired) {
            reciver.socket.send(
              JSON.stringify({
                type: "receiveMessage",
                message: response.message,
                isPaired: true,
              })
            );
          }
          break;
        }
        default:
          ws.send("Invalid request");
          break;
      }
    });
  } catch (e: any) {
    console.log(new Date() + "\t" + e);
    ws.send(JSON.stringify({ status: "Error", message: e.message }));
  }

  ws.on("close", () => {
    console.log(new Date() + "\tConnection closed");
    roomManager.removeRoombyUser(userManager.getUserById(ws.id)!);
    userManager.removeUserByID(ws.id);
  });
});

// Server listening
server.listen(7860, () => {
  console.log("Server is running on port 7860");
});
