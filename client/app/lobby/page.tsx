"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { MoveRight, ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function LobbyPage() {
  const [hoveredSide, setHoveredSide] = useState<"create" | "join" | null>(
    null,
  );
  const [clickSide, setClickSide] = useState<"create" | "join" | null>(null);

  const router = useRouter();

  const handleClick = (action: "create" | "join") => {
    setClickSide(action);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <main className="flex h-screen min-h-screen w-full flex-col items-center justify-center text-center lg:flex-row">
      <motion.div
        id="create-room"
        className={`relative flex cursor-pointer items-center justify-center bg-[#00ccaa] text-white ${clickSide === null ? "h-1/2 w-full lg:h-full lg:w-1/2" : clickSide === "create" ? "h-full w-full" : "hidden h-0 w-0"}`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setHoveredSide("create")}
        onHoverEnd={() => setHoveredSide(null)}
        onClick={() => handleClick("create")}
      >
        {clickSide === null ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: hoveredSide === "create" ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-4 text-4xl font-bold">Create a Room</h2>
            <p className="mb-6 text-xl">
              Start a new chat room for others to join
            </p>
            <motion.div
              className="inline-flex items-center"
              initial={{ x: 0 }}
              animate={{ x: hoveredSide === "create" ? 10 : 0 }}
            >
              <span className="mr-2">Get Started</span>
              <MoveRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ) : (
          clickSide === "create" && (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center border-2 border-gray-300 rounded-lg p-6">
              <div className="flex flex-col space-x-4 items-center">
                <Label htmlFor="username" className="text-2xl">Username</Label>
                <Input className="text-2xl" id="username" placeholder="Enter your username" />
              </div>
              <Button size="lg" type="submit">Create Room</Button>
            </form>
          )
        )}
      </motion.div>
      <motion.div
        id="join-room"
        className={`relative flex cursor-pointer items-center justify-center bg-[#0066cc] text-white ${clickSide === null ? "h-1/2 w-full lg:h-full lg:w-1/2" : clickSide === "join" ? "h-full w-full" : "hidden h-0 w-0"}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onHoverStart={() => setHoveredSide("join")}
        onHoverEnd={() => setHoveredSide(null)}
        onClick={() => handleClick("join")}
      >
        {clickSide === null ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: hoveredSide === "join" ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-4 text-4xl font-bold">Join a Room</h2>
            <p className="mb-6 text-xl">Enter an existing chat room</p>
            <motion.div
              className="inline-flex items-center"
              initial={{ x: 0 }}
              animate={{ x: hoveredSide === "join" ? 10 : 0 }}
            >
              <span className="mr-2">Enter Room</span>
              <MoveRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ) : (
          clickSide === "join" && <div>join</div>
        )}
      </motion.div>
      {clickSide !== null && (
        <Button
          onClick={() => setClickSide(null)}
          className="absolute left-4 top-4 cursor-pointer space-x-2 text-xl text-white"
        >
          <ChevronsLeft />
          <span>close</span>
        </Button>
      )}
    </main>
  );
}

export default LobbyPage;
