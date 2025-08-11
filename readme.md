📌 Project Description

Realtime Collaborative Code Editor is a web-based application that allows multiple users to write, edit, and run code together in real time.
Built with Vite + React for the frontend, Express + Socket.IO for the backend, and the Piston API for code execution, it supports multi-user rooms, live typing updates, language switching, and live output sharing.


---

🚀 Features

Real-time Collaboration – Multiple users can edit code together.

Multi-Room Support – Separate workspaces for different groups.

Live Typing Indicator – See when other users are typing.

Language Switching – Change programming language instantly.

Code Execution – Run code in various languages via the Piston API.

Persistent State for New Users – New users see the current code instantly when they join.

Frontend Build Serving – The backend serves the production frontend build for deployment.



---

🛠 Tech Stack

Frontend

Vite + React

Tailwind CSS (for styling)

Socket.IO Client


Backend

Node.js

Express.js

Socket.IO

Axios (for API requests)


External Services

Piston API for code compilation & execution.



---

📂 Project Structure

project-root/
│
├── backend/
│   ├── index.js           # Main backend server file
│   ├── package.json       # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind setup
│
└── README.md


---

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/realtime-code-editor.git
cd realtime-code-editor

2️⃣ Install Backend Dependencies

cd backend
npm install

3️⃣ Install Frontend Dependencies

cd ../frontend
npm install

4️⃣ Run in Development Mode

In backend terminal:

cd backend
npm run dev

In frontend terminal:

cd frontend
npm run dev


---

🔧 Environment Variables

Create a .env file inside the backend folder:

PORT=5000
# You can also configure any API keys here if needed


---

📡 API & Socket Events

Socket Events from Client → Server

Event	Data	Purpose

join	{ roomId, userName }	Join a room and broadcast updated user list.
codeChange	{ roomId, code }	Broadcast updated code to all users in the room.
typing	{ roomId, userName }	Show typing indicator to others.
languageChange	{ roomId, language }	Change programming language for the room.
compileCode	{ code, roomId, language, version, input }	Send code to Piston API for execution.
leaveRoom	—	Leave the current room.


Socket Events from Server → Client

Event	Data	Purpose

userJoined	Array<string>	Updated list of users in room.
codeUpdate	string	Latest code snapshot.
userTyping	string	User who is typing.
languageUpdate	string	New programming language.
codeResponse	{ run: { output: string }}	Compilation result from Piston API.



---

🖥 Deployment

Build Frontend

cd frontend
npm run build

Copy the dist folder into your backend/frontend/ directory so the backend can serve it.

Deploy to Render/Heroku

Set PORT in environment variables.

Run npm start in backend.



---

📜 License

MIT License.
Free to use and modify.




