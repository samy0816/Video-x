# Video X

A modern, full-stack video meeting and collaboration platform inspired by Zoom, built with React, Node.js, Express, Socket.io, and Gemini AI integration.

---

## 🚀 Features

- **User Authentication**: Secure sign up, login, and session management
- **Video Meetings**: Real-time video and audio conferencing with WebRTC and Socket.io
- **AI Smart Assistant**: Gemini-powered sidebar for meeting Q&A, summaries, and suggested clarifying questions
- **Live Chat**: In-meeting chat with message history
- **Meeting History**: View past meetings and summaries
- **Responsive UI**: Modern, glassmorphic design, fully responsive for desktop and mobile
- **Custom Video Backgrounds**: Video backgrounds with gradient overlays
- **Meeting Code System**: Join meetings via unique codes
- **User Meeting History**: Track and revisit previous meetings

---

## 🖥️ Tech Stack

- **Frontend**: React, Material-UI, CSS Modules
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **AI Integration**: Google Gemini API (for Smart Assistant)
- **Authentication**: Passport.js, JWT, bcrypt
- **Deployment**: Render (backend), Netlify/Vercel (frontend)

---

## 📦 Project Structure
/frontend /public video1.mp4, video2.gif, ... /src /pages authentication.jsx home.jsx history.jsx landing.jsx VideoMeet.jsx /contexts /styles /utils App.js, App.css, ... /backend /src /routes ai.routes.js /controllers /models app.js .env package.json


---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/samy0816/Video-x.git
cd Video-x
```
2. Setup the Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your values
cp .env.example .env
# Start the backend
npm start
```
Backend .env Example

```bash
PORT=8000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

3. Setup the Frontend
```bash
cd ../frontend
npm install
npm start
```

Frontend Environment
Update /src/environment.js if you deploy the backend to a live server.

🤖 AI Smart Assistant
The AI sidebar uses Google Gemini API to answer questions about the meeting transcript and suggest clarifying questions.
Configure your Gemini API key in the backend .env.
🌐 Deployment
Backend: Deploy to Render or similar. Set environment variables in the dashboard.
Frontend: Deploy to Netlify, Vercel, or similar. Update the backend URL in /src/environment.js.
📝 License
MIT License

🙏 Credits
Material-UI
Socket.io
Google Gemini API
React
Node.js
Render

Author : Samarth Joshi
