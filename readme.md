<h1 align="center">🧑‍💻 Realtime Collaborative Code Editor</h1>
<p align="center">
  A web app to write, edit, and run code together in real time.<br/>
  Frontend: <b>Vite + React + Tailwind</b> · Backend: <b>Express + Socket.IO</b> · Execution: <b>Piston API</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#setup--development">Setup</a> •
  <a href="#environment-variables">Env</a> •
  <a href="#scripts">Scripts</a> •
  <a href="#socket-events">Socket Events</a> •
  <a href="#deployment-single-server">Deployment</a> •
  <a href="#license">License</a>
</p>

<hr/>

<h2 id="description">📌 Project Description</h2>
<p>
  <b>Realtime Collaborative Code Editor</b> lets multiple users collaborate on code in shared rooms with live updates, typing indicators, language switching, and server-side code execution via the Piston API. It supports a single-server deployment where Express serves the production React build.
</p>

<h2 id="features">🚀 Features</h2>
<ul>
  <li><b>Real-time Collaboration</b> across multiple users and rooms</li>
  <li><b>Live Typing Indicator</b> to see who’s active</li>
  <li><b>Language Switching</b> (JS, Python, Java, C++)</li>
  <li><b>Code Execution</b> via Piston API (with input/stdin support)</li>
  <li><b>New Joiner Sync</b>: late joiners receive the current code snapshot</li>
  <li><b>Single-Server Production</b>: Express serves <code>frontend/dist</code></li>
</ul>

<h2 id="tech-stack">🛠 Tech Stack</h2>
<ul>
  <li><b>Frontend:</b> Vite, React, Tailwind CSS, Monaco Editor, Socket.IO Client</li>
  <li><b>Backend:</b> Node.js, Express, Socket.IO, Axios</li>
  <li><b>Execution:</b> Piston API</li>
</ul>

<h2 id="project-structure">📂 Project Structure</h2>
<pre><code>project-root/
├─ backend/
│  ├─ index.js           # Express + Socket.IO server
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ Home.jsx
│  │  │  └─ EditorPage.jsx
│  │  ├─ App.jsx, main.jsx
│  │  └─ styles / components ...
│  ├─ public/
│  ├─ tailwind.config.js
│  └─ package.json
└─ README.md (this file)
</code></pre>

<h2 id="setup--development">⚙️ Setup &amp; Development</h2>

<h3>1) Clone</h3>
<pre><code>git clone https://github.com/&lt;your-username&gt;/realtime-code-editor.git
cd realtime-code-editor
</code></pre>

<h3>2) Install</h3>
<p><b>Backend</b></p>
<pre><code>cd backend
npm install
</code></pre>
<p><b>Frontend</b></p>
<pre><code>cd ../frontend
npm install
</code></pre>

<h3>3) Run (Dev)</h3>
<p>Run backend (port 5000 by default):</p>
<pre><code>cd backend
npm run dev   # or: node index.js
</code></pre>
<p>Run frontend (Vite dev server, usually 5173):</p>
<pre><code>cd ../frontend
npm run dev
</code></pre>

<h2 id="environment-variables">🔧 Environment Variables</h2>
<p>Create <code>.env</code> (frontend) if you want to point to a custom backend URL:</p>
<pre><code># frontend/.env
VITE_SERVER_URL=http://localhost:5000
</code></pre>
<p>Create <code>.env</code> (backend) if needed:</p>
<pre><code># backend/.env
PORT=5000
</code></pre>

<h2 id="scripts">📜 Scripts</h2>
<p>At the root you can use a convenience build script to build the frontend and prepare for single-server deployment:</p>
<pre><code>{
  "scripts": {
    "build": "npm install && cd frontend && npm install && npm run build",
    "start": "node backend/index.js"
  }
}
</code></pre>

<h2 id="socket-events">📡 Socket Events</h2>

<h3>Client → Server</h3>
<table>
  <thead>
    <tr><th>Event</th><th>Payload</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    <tr><td><code>join</code></td><td><code>{ roomId, userName }</code></td><td>Join a room; server broadcasts current user list &amp; sends code snapshot to joiner</td></tr>
    <tr><td><code>codeChange</code></td><td><code>{ roomId, code }</code></td><td>Update room code (server stores latest snapshot and broadcasts)</td></tr>
    <tr><td><code>typing</code></td><td><code>{ roomId, userName }</code></td><td>Broadcast typing indicator</td></tr>
    <tr><td><code>languageChange</code></td><td><code>{ roomId, language }</code></td><td>Switch room language</td></tr>
    <tr><td><code>compileCode</code></td><td><code>{ code, roomId, language, version, input }</code></td><td>Execute code via Piston API</td></tr>
    <tr><td><code>leaveRoom</code></td><td>—</td><td>Leave current room and update user list</td></tr>
  </tbody>
</table>

<h3>Server → Client</h3>
<table>
  <thead>
    <tr><th>Event</th><th>Payload</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    <tr><td><code>userJoined</code></td><td><code>string[]</code></td><td>Updated user list for room</td></tr>
    <tr><td><code>codeUpdate</code></td><td><code>string</code></td><td>Current code (live updates &amp; snapshot on join)</td></tr>
    <tr><td><code>userTyping</code></td><td><code>string</code></td><td>Who is typing</td></tr>
    <tr><td><code>languageUpdate</code></td><td><code>string</code></td><td>Current language</td></tr>
    <tr><td><code>codeResponse</code></td><td><code>{ run: { output, stderr, stdout, ... }, error? }</code></td><td>Execution result or error message</td></tr>
  </tbody>
</table>

<h2 id="deployment-single-server">🖥 Deployment (Single Server)</h2>
<p>
  The backend is configured to serve the production React build from <code>frontend/dist</code>. Your Express code should look like:
</p>
<pre><code>import path from "path";
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.all("/*", (req, res) =&gt; {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
</code></pre>

<h3>Build &amp; Start</h3>
<pre><code># from project root
npm run build

# then run the backend (serves API + built frontend)
npm run start
# open http://localhost:5000
</code></pre>

<h2 id="notes">📝 Notes &amp; Tips</h2>
<ul>
  <li><b>Express v4 vs v5:</b> If you’re on Express v5, use <code>app.all("/*", ...)</code> instead of <code>app.get("*", ...)</code> to avoid <i>path-to-regexp</i> errors.</li>
  <li><b>Piston versions:</b> Pass a valid <code>version</code> from the frontend or default on the backend. If you get HTTP 400, verify the language/version supported by Piston.</li>
  <li><b>Late joiners:</b> Store the current code on the server and emit a <code>codeUpdate</code> to the joining socket immediately after <code>join</code>.</li>
  <li><b>Cleanup:</b> On unmount, emit <code>leaveRoom</code> and <code>disconnect()</code> the socket to avoid duplicate listeners.</li>
</ul>

<h2 id="license">📜 License</h2>
<p>MIT License — free to use and modify.</p>
