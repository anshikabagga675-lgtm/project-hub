# Project Hub

Project Hub is a responsive collaborative project management frontend inspired
by Trello and Asana. This increment establishes the complete UI foundation
using React, Vite, JavaScript, React Router, Axios, Lucide icons, and plain CSS.

## Frontend features

- Public login and registration screens with local mock authentication.
- Protected dashboard, project board, and profile routes.
- Mock project/task statistics, search and project status filters.
- Local project and task creation/edit/deletion, task comments, and notifications.
- Responsive sidebar, top navigation, project cards, modals, and horizontally
  scrollable Kanban columns.

The frontend uses mock data and does not call the backend yet. Account profiles
are kept in browser storage for this demo. Passwords for locally registered
mock accounts are stored as salted PBKDF2 hashes; this is UI scaffolding, not a
replacement for production authentication on a trusted backend.

## Run the frontend

```sh
cd frontend
npm install
npm run dev
```

For demo access, use `demo@projecthub.com` with password `password123`, or
register a local mock account. Run `npm run lint` and `npm run build` from the
`frontend` directory to validate the application.

## Backend

The separate Express/Mongoose backend remains in `backend/`. Backend API
integration is intentionally deferred; frontend service modules currently use
local mock data.
