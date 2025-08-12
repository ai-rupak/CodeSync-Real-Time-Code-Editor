import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import axios from "axios";

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // <-- tighten in production (e.g. ['https://yourfrontend.com'])
  },
});



// Optional keep-alive ping (used on some free hosts like Render to avoid sleeping)
// const KEEP_ALIVE_URL = "http://localhost:5000";
// const KEEP_ALIVE_INTERVAL = 30_000;
// setInterval(async () => {
//   try {
//     await axios.get(KEEP_ALIVE_URL);
//     console.log("keep-alive ping sent");
//   } catch (err) {
//     console.error("keep-alive failed:", err.message);
//   }
// }, KEEP_ALIVE_INTERVAL);

// rooms map: roomId -> { users: Set<string>, output: string }
const rooms = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    let currentRoom = null;
    let currentUser = null;

    socket.on("join", ({ roomId, userName }) => {
    if (!roomId || !userName) return;

    // If previously in a room, remove them from that room first
    if (currentRoom && currentUser) {
      const prev = rooms.get(currentRoom);
      if (prev) {
        prev.users.delete(currentUser);
        if (prev.users.size === 0) {
          rooms.delete(currentRoom); // cleanup empty room
        } else {
          io.to(currentRoom).emit("userJoined", Array.from(prev.users));
        }
      }
      socket.leave(currentRoom);
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set(), output: "" , code: ""});
    }
    rooms.get(roomId).users.add(userName);

    io.to(roomId).emit("userJoined", Array.from(rooms.get(roomId).users));
     const roomData = rooms.get(roomId);
    if (roomData) {
        // Send current code to the new user only
        socket.emit("codeUpdate", roomData.code || "");
    }
  });

  socket.on("codeChange", ({ roomId, code }) => {
    const room = rooms.get(roomId);
    if (room) {
        room.code = code; // store the latest code
    }
    // forward to everyone in room except sender
    socket.to(roomId).emit("codeUpdate", code);
  });

   socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

socket.on("compileCode", async ({ code, roomId, language, version,input }) => {
  try {
    if (!rooms.has(roomId)) {
      return socket.emit("codeResponse", { run: { output: "Room not found" } });
    }


    // debug log (optional, remove in production)
    console.log("Compile request:", { language, version, roomId });

    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version,
      files: [{ content: code }],
      stdin: input,
    });

    // store output on room (optional)
    const room = rooms.get(roomId);
    if (room) room.output = response.data?.run?.output ?? "";

    // broadcast full response
    io.to(roomId).emit("codeResponse", response.data);
  } catch (err) {
    // use the same variable name and emit a clean response so frontend won't hang
    console.error("compile error:", err?.message);
    const errBody = err?.response?.data ?? err?.message ?? "Unknown compile error";

    io.to(roomId).emit("codeResponse", {
      run: {
        output: `Compile request failed:\n${typeof errBody === "string" ? errBody : JSON.stringify(errBody)}`,
      },
      error: true,
    });
  }
});



    socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.users.delete(currentUser);
        if (room.users.size === 0) {
          rooms.delete(currentRoom);
        } else {
          io.to(currentRoom).emit("userJoined", Array.from(room.users));
        }
      }
      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.users.delete(currentUser);
        if (room.users.size === 0) rooms.delete(currentRoom);
        else io.to(currentRoom).emit("userJoined", Array.from(room.users));
      }
    }
    console.log("User disconnected:", socket.id);
  });

})

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log("server is working on port 5000");
});