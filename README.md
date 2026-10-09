# 🚀 Project Hub — Collaborative Project Management

Project Hub is a full-stack project management web application designed to help individuals and teams organize projects, manage tasks, collaborate efficiently, and track progress from one centralized dashboard.

Inspired by tools like Trello and Asana, Project Hub aims to simplify teamwork through project boards, task assignments, comments, and notifications.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Password hashing
- Protected routes and API endpoints

### 📊 Project Dashboard
- View and manage projects
- Create, update, and delete projects
- Track project status and deadlines
- View project statistics and progress

### 📋 Task Management
- Create, edit, and delete tasks
- Assign tasks to team members
- Set task priorities and due dates
- Organize tasks by status

### 🗂️ Kanban Board
Organize tasks into four workflow stages:
- To Do
- In Progress
- Review
- Completed

### 💬 Team Collaboration
- Add comments to tasks
- View comment authors and timestamps
- Collaborate around project activities

### 🔔 Notifications
- Receive task assignment notifications
- View project activity notifications
- Track read and unread notifications

### 📱 Responsive Interface
- Modern dashboard layout
- Reusable React components
- Responsive design for desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS
- React Router
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- REST APIs
- JSON Web Tokens (JWT)
- bcryptjs

**Database**
- MongoDB
- Mongoose

**Development Tools**
- Visual Studio Code
- Git and GitHub
- npm

## 📁 Project Structure

```text
project-hub/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/anshikabagga675-lgtm/project-hub.git
cd project-hub
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal from the project root and run:

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

Add the following configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your own configuration.

Never commit your real `.env` file or expose database credentials and JWT secrets publicly.

If the frontend uses an API URL environment variable, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the Backend

From the `backend/` directory, run:

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

Health check endpoint:

`http://localhost:5000/api/health`

### 6. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

## 🔌 API Endpoints

The backend API base URL is:

`http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Get the authenticated user |
| POST | `/projects` | Create a project |
| GET | `/projects` | Get accessible projects |
| GET | `/projects/:id` | Get project details |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |
| POST | `/tasks` | Create a task |
| GET | `/tasks/project/:projectId` | Get project tasks |
| GET | `/tasks/:id` | Get task details |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| POST | `/comments` | Add a comment |
| GET | `/comments/task/:taskId` | Get task comments |
| DELETE | `/comments/:id` | Delete a comment |
| GET | `/notifications` | Get notifications |
| PUT | `/notifications/:id/read` | Mark a notification as read |
| PUT | `/notifications/read-all` | Mark all notifications as read |
| GET | `/health` | Check API status |

Protected endpoints require a valid JWT access token in the request header:

```text
Authorization: Bearer <your_token>
```

## 🔒 Security

- Passwords are hashed before storage.
- Protected routes require authentication.
- Environment variables are used for private configuration.
- API access should be restricted according to project membership and user permissions.
- Secrets and database credentials must not be committed to GitHub.

## 🗺️ Future Enhancements

- Real-time collaboration using Socket.IO
- Live task and comment updates
- Drag-and-drop Kanban task management
- Email notifications
- Advanced project analytics
- File attachments
- Team invitations and role-based permissions
- Deployment with a production database

*These enhancements will be added as development progresses.*

## 🧑‍💻 Development Workflow

Contributions and improvements can be managed using Git branches.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Describe your changes"
git push -u origin feature/your-feature
```

## 👩‍💻 Author

**Anshika Bagga**

- GitHub: [@anshikabagga675-lgtm](https://github.com/anshikabagga675-lgtm)
- Project Repository: [Project Hub](https://github.com/anshikabagga675-lgtm/project-hub)

## 📄 License

This project is currently a personal development project. A license can be added when the distribution terms are decided.
