"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSocketStore } from "@/lib/SocketContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemoizedVortexBackground } from "@/components/VortexBackground";

function RoomPage() {
  const [messages, setMessages] = useState<string[]>([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(""); // Input field
  const Socket = useSocketStore();
  const socket = useRef<null | WebSocket>(null);
  const roomID = useRef<string | null>(null);

  useEffect(() => {
    socket.current = Socket.getSocket();
    roomID.current = Socket.getRoomID();

    // Listen for incoming messages
    if (socket.current) {
      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data && data.type === "receiveMessage") {
          setMessages((prevMessages: string[]) => [
            ...prevMessages,
            data.message,
          ]);
        }
      };
    }
  }, []);

  // Send message to WebSocket server
  const sendMessage = () => {
    if (socket.current && newMessage.trim()) {
      const date = new Date();
      socket.current.send(
        JSON.stringify({
          type: "sendMessage",
          message: `${newMessage.trim()} - ${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()} ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`,
          roomID: roomID.current,
        }),
      );
      setNewMessage("");
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <h2>Chat</h2>
        <div className="rounded-lg border-2 border-gray-300 p-2">
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>

        <div>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full rounded-lg border-2 border-gray-300 p-2"
          />
          <Button onClick={sendMessage} className="w-full">
            Send
          </Button>
        </div>
      </div>
      <MemoizedVortexBackground className="absolute left-0 top-0 h-full w-full" />
    </div>
  );
}

export default RoomPage;
