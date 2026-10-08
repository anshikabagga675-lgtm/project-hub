import {
  Bell, CircleCheckBig, FolderKanban, LayoutDashboard, LogOut, UserRound,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My Projects', to: '/dashboard?view=projects', icon: FolderKanban },
  { label: 'Tasks', to: '/dashboard?view=tasks', icon: CircleCheckBig },
  { label: 'Notifications', to: '/dashboard?view=notifications', icon: Bell },
]

function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {isOpen && <button className="sidebar-backdrop" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <NavLink className="sidebar-brand" onClick={onClose} to="/dashboard">
          <span className="brand-symbol">P</span>
          <span>project<span>hub</span></span>
        </NavLink>

        <p className="sidebar-caption">WORKSPACE</p>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              className={({ isActive }) => `nav-link ${isActive && label === 'Dashboard' ? 'nav-link-active' : ''}`}
              key={label}
              onClick={onClose}
              to={to}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Notifications' && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-upgrade">
          <span className="upgrade-sparkle">✦</span>
          <strong>Your team, in sync.</strong>
          <p>Great work starts with a clear plan.</p>
          <div className="upgrade-progress"><span /></div>
          <span className="upgrade-meta">Workspace is looking good</span>
        </div>
        <div className="sidebar-bottom">
          <NavLink className="nav-link" onClick={onClose} to="/profile">
            <UserRound size={18} strokeWidth={1.8} /><span>Profile</span>
          </NavLink>
          <button className="nav-link logout-link" onClick={handleLogout} type="button">
            <LogOut size={18} strokeWidth={1.8} /><span>Log out</span>
          </button>
        </div>
        <div className="sidebar-version">PROJECT HUB <span>v1.0</span></div>
      </aside>
    </>
  )
}

export default Sidebar
