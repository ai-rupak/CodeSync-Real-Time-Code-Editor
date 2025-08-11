import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { defaultVersions } from "../constants";

const EditorPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [ language , setLanguage] = useState("cpp")
  const [typing, setTyping] = useState("");
  const [code, setCode] = useState("// start code here");
  const [output, setOutput] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const [userInput, setUserInput]  = useState("")
  const [running, setIsRunning]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username = location.state?.username || `Guest_${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    // connect
    socketRef.current = io(SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log("connected to socket server", socketRef.current.id);
      // join the room with username
      socketRef.current.emit("join", { roomId, userName: username });
    });

    // when server sends updated user list
    socketRef.current.on("userJoined", (userList) => {
      setUsers(userList);
    });

    // when other client sends code update
    socketRef.current.on("codeUpdate", (newCode) => {
      setCode(newCode ?? "");
    });

    // when language changes in room
    socketRef.current.on("languageUpdate", (lang) => {
      setLanguage(lang);
    });

    // typing indicator
    socketRef.current.on("userTyping", (userName) => {
      setTyping(`${userName} is typing...`);
      // clear after short delay
      setTimeout(() => setTyping(""), 1500);
    });

    // compile response
     socketRef.current.on("codeResponse", (data) => {
      setIsRunning(false);
    if (data?.run?.stderr) {
      setOutput(data.run.stderr);
    } else {
      setOutput(data?.run?.output || "No output");
    }
  });




    // cleanup on unmount
    return () => {
      socketRef.current.off("codeResponse");
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    

  },[])


  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    socketRef.current?.emit("languageChange", { roomId, language: lang });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  };
  const leaveRoom = () => {
    socketRef.current?.emit("leaveRoom");
    navigate("/");
  };

   const handleCodeChange = (value) => {
    setCode(value ?? "");
    // emit to other users (no need to include username here)
    socketRef.current?.emit("codeChange", { roomId, code: value ?? "" });
    // emit typing (throttle in large apps)
    socketRef.current?.emit("typing", { roomId, userName: username });
  };
  
const runCode = () => {
    setIsRunning(true);
    setOutput("Running...");
    const versionToUse = defaultVersions[language];
    socketRef.current?.emit("compileCode", {
      code,
      roomId,
      language,
      version : versionToUse,
      input:userInput,
    });
  };

  return (
     <div className="h-screen bg-gray-900 text-white overflow-hidden font-mono">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white">
              Code Sync
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-400">Room:</span>
              <code className="bg-gray-700 px-2 py-1 rounded text-gray-300 font-mono">
                {roomId?.slice(0, 8)}...
              </code>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            
            <button
              onClick={runCode}
              disabled={running}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {running ? "Running..." : "▶ Run"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-300`}>
          <div className="p-4 h-full flex flex-col">
            {/* Room Info */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Room ID</h3>
              <button
                onClick={copyRoomId}
                className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg p-2 text-left transition-colors group"
              >
                <code className="text-blue-400 text-xs font-mono break-all">{roomId}</code>
                <span className="text-xs text-gray-400 block mt-1 group-hover:text-blue-300">Click to copy</span>
              </button>
            </div>

            {/* Users */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Active Users ({users.length})
              </h3>
              <div className="space-y-1">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-700 rounded-lg p-2"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-300 font-mono">{user.slice(0, 12)}</span>
                  </div>
                ))}
              </div>
              {typing && (
                <p className="text-xs text-green-400 mt-2 italic">{typing}</p>
              )}
            </div>

            {/* User Info */}
            <div className="mt-auto space-y-3">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Your Username</span>
                <div className="bg-gray-700 rounded-lg p-2">
                  <span className="text-sm font-mono text-gray-300">{username}</span>
                </div>
              </div>
              
              <button
                onClick={leaveRoom}
                className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 border border-purple-500/20 rounded-lg m-4 mb-2 overflow-hidden bg-black/20">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'gutter',
                selectionHighlight: false,
                cursorBlinking: 'smooth',
              }}
            />
          </div>

          {/* Input/Output Console */}
          <div className="flex gap-4 p-4 pt-0">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">Input</label>
              <textarea
                className="w-full h-32 bg-black/40 border border-purple-500/20 rounded-lg p-3 text-sm font-mono resize-none focus:border-purple-400 outline-none text-yellow-300"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter input for your program..."
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">Output</label>
                <button
                  onClick={() => setOutput("")}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
              <textarea
                className="w-full h-32 bg-black/40 border border-purple-500/20 rounded-lg p-3 text-sm font-mono resize-none text-green-300"
                value={output}
                readOnly
                placeholder="Output will appear here..."
              />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EditorPage;
