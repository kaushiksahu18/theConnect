import { ExtWebSocket } from "../types";

type User = {
  name: string;
  socket: ExtWebSocket;
};

export class UserManager {
  private users: User[];
  constructor() {
    this.users = [];
  }

  addUser(name: string, socket: ExtWebSocket) {
    this.users.push({ name, socket });
  }

  removeUser(socketID: string) {
    this.users = this.users.filter((user) => user.socket.id !== socketID);
  }

  getUsers() {
    return this.users;
  }
}
