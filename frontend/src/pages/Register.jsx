import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

function Register() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Your password must be at least 8 characters.')
    if (form.password !== form.confirmPassword) return setError('Those passwords do not match.')
    if (!termsAccepted) return setError('Please accept the terms to create your account.')

    setIsSubmitting(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout mode="register">
      <h2>Create your account</h2>
      <p className="auth-description">Your team’s next chapter starts here.</p>
      <form className="auth-fields register-fields" onSubmit={handleSubmit}>
        <label className="form-field">Full name<input autoComplete="name" maxLength={80} onChange={updateField('name')} placeholder="Jordan Lee" required value={form.name} /></label>
        <label className="form-field">Email address<input autoComplete="email" onChange={updateField('email')} placeholder="you@company.com" required type="email" value={form.email} /></label>
        <label className="form-field">Password<div className="password-field"><input autoComplete="new-password" minLength={8} onChange={updateField('password')} placeholder="At least 8 characters" required type={showPassword ? 'text' : 'password'} value={form.password} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        <label className="form-field">Confirm password<input autoComplete="new-password" onChange={updateField('confirmPassword')} placeholder="Enter your password again" required type="password" value={form.confirmPassword} /></label>
        <label className="checkbox-row terms-row"><input checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} type="checkbox" /><span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</span></label>
        {error && <p className="form-error auth-error" role="alert">{error}</p>}
        <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">{isSubmitting ? <><span className="button-spinner" />Creating account...</> : <>Create account <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  )
}

export default Register
