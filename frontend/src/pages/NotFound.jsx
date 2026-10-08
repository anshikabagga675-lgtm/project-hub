import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="not-found-page">
      <Link className="sidebar-brand not-found-brand" to="/dashboard"><span className="brand-symbol">P</span><span>project<span>hub</span></span></Link>
      <div className="not-found-content"><span className="not-found-icon"><Compass size={27} /></span><span className="section-kicker">A LITTLE OFF COURSE</span><h1>We can’t find that page.</h1><p>The page may have moved, or the link might be out of date.</p><Link className="button button-primary" to="/dashboard"><ArrowLeft size={16} />Back to your workspace</Link></div>
      <span className="not-found-number">404</span>
    </main>
  )
}

export default NotFound
