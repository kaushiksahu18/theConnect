"use client";
import React from "react";
import { createContext } from "react";

export const WEBSOCKET_URI = "wss://kaushiksahu-theconnect-backend-api-nodejs.hf.space";
// export const WEBSOCKET_URI = "ws://localhost:7860";

class Socket {
  private socket: WebSocket | null;
  private roomID: string | null;

  constructor() {
    this.socket = null;
    this.roomID = null;
  }

  connect() {
    const socket = new WebSocket(WEBSOCKET_URI);
    console.log("Connecting to WebSocket server...");

    this.socket = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      this.socket = null;
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return this;
  }

  setRoomID(roomID: string) {
    this.roomID = roomID;
    return this.roomID;
  }

  getRoomID() {
    return this.roomID;
  }

  getSocket() {
    if (!this.socket) {
      console.log("WebSocket is not connected");
    }
    return this.socket;
  }

  getOBJ() {
    return this;
  }
}

const SocketContext = createContext(new Socket());

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={new Socket()}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
