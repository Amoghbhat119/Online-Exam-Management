# 🧠 Online Exam Management System

A **Full-Stack Online Exam Platform** built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
It allows **Admins** to create and manage exams, and **Students** to register, take exams, and view results — all with real-time analytics and auto submission.

---

## 🚀 Features

### 👨‍🏫 Admin Features
- Create, edit, and delete exams.
- Add multiple questions (MCQs) to each exam.
- Set exam timer and auto-submit functionality.
- View students’ performance analytics and results.
- Prevent students from retaking the same exam.

### 🧑‍🎓 Student Features
- Register and log in securely.
- Attempt exams only once.
- Auto-submit when time runs out.
- View result and performance immediately after submission.

### 🌗 UI Enhancements
- Modern responsive UI with TailwindCSS.
- Dark/Light mode toggle.
- Smooth animations and clean layout.

---

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|----------------|
| **Frontend** | React.js (Vite) + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Token) |
| **Deployment** | Render (Backend), Vercel (Frontend) |

---

## ⚙️ Installation Guide

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Amoghbhat119/Online-Exam-Management.git
cd Online-Exam-Management


2️⃣ Backend setup
cd backend
npm install


Create a .env file inside the backend folder:

MONGO_URI=your_mongo_uri_here
PORT=5000
JWT_SECRET=your_secret_key


Start the backend:

npm start

3️⃣ Frontend setup
cd ../frontend
npm install
npm run dev
🧩 Folder Structure
Online-Exam-Management/
│
├── backend/               # Express backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── server.js          # Entry point
│   └── .env               # Environment variables (ignored in Git)
│
├── frontend/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Exam, Login, Dashboard, etc.
│   │   └── App.jsx        # Root component
│   └── vite.config.js     # Vite configuration
│
└── README.md