# Team Task Manager

A full-stack, production-ready web application for team task management. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Authentication**: JWT-based secure login & registration.
- **Role-Based Access Control**: Admins can manage projects and assign tasks; Members can view and update their tasks.
- **Dashboard**: High-level overview of pending, completed, and overdue tasks.
- **Modern UI**: Clean, responsive design using Tailwind CSS.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose

## Setup Instructions

### 1. Database Setup
Ensure you have a MongoDB instance running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `backend/.env` to point to your MongoDB Atlas cluster.

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment Guide (Railway)

### Database Deployment
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Whitelist `0.0.0.0/0` (allow access from anywhere) in Network Access.
3. Get your connection string (replace password).

### Backend Deployment
1. Push your repository to GitHub.
2. Create a new project on [Railway](https://railway.app/).
3. Choose "Deploy from GitHub repo" and select your repository.
4. Set the Root Directory to `/backend`.
5. Add the following Environment Variables in Railway:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `PORT`: (Railway assigns this automatically, but you can set it).
6. Wait for the build and deployment to finish, and copy the deployed backend URL.

### Frontend Deployment
1. In the same Railway project, create a new service from the same GitHub repo.
2. Set the Root Directory to `/frontend`.
3. Set the build command to `npm run build` and start command to serve the static files or use Railway's static site deployment.
4. Add the Environment Variable:
   - `VITE_API_URL`: The deployed backend URL (e.g., `https://your-backend.up.railway.app/api`).
5. Deploy and enjoy!

## Demo Script

**[0:00 - 0:30] Introduction & Authentication:**
"Welcome to the Team Task Manager. This is a full-stack application built with React, Node.js, and MongoDB. We start at the login page, which is secured by JWT authentication. I'll log in as an Admin. Passwords are securely hashed using bcrypt."

**[0:30 - 1:00] The Dashboard & RBAC:**
"Upon logging in, we land on the Dashboard. Here we see a quick summary: total tasks, pending, completed, and overdue. The app enforces Role-Based Access Control. Because I am an Admin, my sidebar allows me to create new projects and assign tasks. If I were a regular Member, I'd only see tasks assigned to me."

**[1:00 - 1:30] Project & Task Management:**
"Let's navigate to Projects. I can create a new project and add team members to it. Moving to the Tasks tab, I can create a task, set a due date, and assign it to a specific user. The UI is built with Tailwind CSS, using color-coded badges to make task statuses instantly recognizable."

**[1:30 - 2:00] Member View & Technical Polish:**
"If a Member logs in, they can view their assigned tasks and move them from 'Todo' to 'In Progress' to 'Completed'. The entire application handles errors gracefully with toast notifications and loading states. It's fully RESTful, modular, and deployed securely."
