import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import Loading from './Loading.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <Loading />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
