# Project Hub

Project Hub is a collaborative project management application inspired by
Trello and Asana. The project has a responsive React/Vite frontend and a
separate Express/Mongoose REST API.

## Frontend

The frontend uses JavaScript, React Router, Axios, Lucide icons, and plain CSS.
It currently provides local mock authentication and mock project/task data.
Its service modules are not yet connected to the backend API.

```sh
cd frontend
npm install
npm run dev
```

Demo login: `demo@projecthub.com` / `password123`. For the frontend, run
`npm run lint` and `npm run build` inside `frontend`.

## Backend

The backend provides MongoDB-backed authentication, projects, tasks, comments,
and notifications. To run it:

1. Replace the placeholder values in `backend/.env` (or copy
   `backend/.env.example` to create it).
2. Set `MONGO_URI` to your MongoDB connection string and `JWT_SECRET` to a
   private random secret of at least 32 characters.
3. Start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

The API defaults to port 5000 and allows `http://localhost:5173` as its
development frontend origin. Set `FRONTEND_URL` to override or provide a
comma-separated list of allowed origins. `backend/.env` is git-ignored.

### API routes

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/projects`, `GET /api/projects`, `GET /api/projects/:id`,
  `PUT /api/projects/:id`, `DELETE /api/projects/:id`,
  `POST /api/projects/:id/members`
- `POST /api/tasks`, `GET /api/tasks/project/:projectId`,
  `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`
- `POST /api/comments`, `GET /api/comments/task/:taskId`,
  `DELETE /api/comments/:id`
- `GET /api/notifications`, `PUT /api/notifications/:id/read`,
  `PUT /api/notifications/read-all`

Except for the health check, all API routes require a valid
`Authorization: Bearer <token>` header.
