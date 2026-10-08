import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login({ email, password, remember })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout mode="login">
      <h2>Welcome back</h2>
      <p className="auth-description">Sign in to pick up where your team left off.</p>
      <form className="auth-fields" onSubmit={handleSubmit}>
        <label className="form-field">Email address<input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required type="email" value={email} /></label>
        <div className="password-label-row"><label className="form-field">Password</label><a href="#forgot-password" onClick={(event) => event.preventDefault()}>Forgot password?</a></div>
        <div className="password-field"><input autoComplete="current-password" minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required type={showPassword ? 'text' : 'password'} value={password} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <label className="checkbox-row"><input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" /><span>Remember me</span></label>
        {error && <p className="form-error auth-error" role="alert">{error}</p>}
        <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">{isSubmitting ? <><span className="button-spinner" />Signing in...</> : <>Sign in <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">New to Project Hub? <Link to="/register">Create an account</Link></p>
      <p className="demo-hint">Demo access: <strong>demo@projecthub.com</strong> / <strong>password123</strong></p>
    </AuthLayout>
  )
}

export default Login
