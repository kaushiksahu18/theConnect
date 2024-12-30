import { ExtWebSocket } from "../types";

type User = {
  name: string;
  socket: ExtWebSocket;
};

type Room = {
  id: string;
  user1: User;
  user2: User;
};

export class RoomManager {
  private rooms: Room[];
  constructor() {
    this.rooms = [];
  }

  createRoom(user1: User, user2: User) {
    this.rooms.push({ id: user1.socket.id + user2.socket.id, user1, user2 });
  }

  removeRoom(roomID: string) {
    this.rooms = this.rooms.filter((room) => room.id !== roomID);
  }

  getRooms() {
    return this.rooms;
  }
}
