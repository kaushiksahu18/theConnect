import { ExtWebSocket } from "../types";
import { User } from "./UserManager";

interface Room {
  id: string;
  user1: User;
  user2: User;
}

export class RoomManager {
  private rooms: Room[];
  constructor() {
    this.rooms = [];
  }

  startNewRoom(user1: User) {
    const roomID = user1.socket.id + user1.socket.id;
    this.rooms.push({ id: roomID, user1: user1, user2: user1 });
    return roomID;
  }

  createRoom(roomID: string, user2: User) {
    const room = this.rooms.find((room) => room.id === roomID);
    if (room) {
      room.user2 = user2;
      room.id = room.user1.socket.id + room.user2.socket.id;
      room.user2.isPaired = true;
      room.user1.isPaired = true;
      room.user1.socket.send(
        JSON.stringify({
          status: "Room created",
          roomID: room.id,
          isPaired: true,
        })
      );
      return room.id;
    }
    return "room not found";
  }

  removeRoomById(roomID: string) {
    const room = this.rooms.find((room) => room.id === roomID);
    if (room) {
      room.user1.isPaired = false;
      room.user2.isPaired = false;
      this.rooms = this.rooms.filter((room) => room.id !== roomID);
      return room;
    }
    return "room not found";
  }

  removeRoombyUser(user: User) {
    const room = this.rooms.find(
      (room) => room.user1 === user || room.user2 === user
    );
    if (room) {
      room.user1.isPaired = false;
      room.user2.isPaired = false;
      this.rooms = this.rooms.filter(
        (room) => room.user1 !== user && room.user2 !== user
      );
      room.user1.socket.send(
        JSON.stringify({ status: "Room left", isPaired: false })
      );
      room.user2.socket.send(
        JSON.stringify({ status: "Room left", isPaired: false })
      );
      return room;
    }
    return "room not found";
  }

  getRoombyId(roomID: string) {
    return this.rooms.find((room) => room.id === roomID);
  }

  getRooms() {
    return this.rooms;
  }
}