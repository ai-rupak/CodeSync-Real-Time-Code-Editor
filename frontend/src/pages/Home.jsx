import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
    const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!roomId) {
      toast.error("ROOM ID is required");
      return;
    }
    if (!username) {
      toast.error("Username is required");
      return;
    }
    navigate(`/editor/${roomId}`, { state: { username } });
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New room created");
    // navigate(`/editor/${id}`, { state: { username: username || `Guest_${id.slice(0,6)}` } });
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 font-serif">
          Join a Code Room 
        </h2>
        <div className="flex items-center justify-center mb-3">

          <img src="/robo.png" alt="" 
          className="w-20"
          />
        </div>
        <p className="text-gray-400 text-center mb-8 text-sm font-mono">
          Enter a valid Room ID and your username to start collaborating.
        </p>

        <div className="flex flex-col gap-4 font-mono">
          <input
            type="text"
            placeholder="Enter Room ID"
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            // onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            placeholder="Enter Username"
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // onKeyUp={handleInputEnter}
          />
          <button
            onClick={joinRoom}
            className="bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg font-semibold"
          >
            Join Room
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400 font-mono">
          Don’t have an invite?{" "}
          <button
            onClick={createNewRoom}
            className="text-blue-400 hover:underline"
          >
            Create a new room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
