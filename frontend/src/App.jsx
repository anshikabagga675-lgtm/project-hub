import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WorkspaceProvider } from './context/WorkspaceContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Profile from './pages/Profile.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import Register from './pages/Register.jsx'

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/project/:id"
            element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App
