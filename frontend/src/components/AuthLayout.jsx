import { Link } from 'react-router-dom'

function AuthLayout({ children, mode }) {
  const isRegister = mode === 'register'
  return (
    <main className="auth-screen">
      <section className="auth-story">
        <Link className="sidebar-brand auth-brand" to="/login"><span className="brand-symbol">P</span><span>project<span>hub</span></span></Link>
        <div className="auth-story-copy">
          <span className="auth-overline">A LITTLE MORE IN SYNC</span>
          <h1>Make room for the work that matters.</h1>
          <p>Thoughtful project planning for teams building good things together.</p>
        </div>
        <div className="auth-story-bottom"><span className="auth-story-mark">✳</span><span>Less busywork. More meaningful progress.</span></div>
        <div className="auth-decor auth-decor-one" /><div className="auth-decor auth-decor-two" />
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-symbol">P</span><span>project<span>hub</span></span></div>
          <span className="auth-kicker">{isRegister ? 'START SOMETHING GOOD' : 'YOUR WORKSPACE IS WAITING'}</span>
          {children}
        </div>
        <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </section>
    </main>
  )
}

export default AuthLayout
