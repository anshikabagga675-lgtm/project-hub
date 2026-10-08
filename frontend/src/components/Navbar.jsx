import { Bell, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useWorkspace } from '../context/useWorkspace.js'
import NotificationPanel from './NotificationPanel.jsx'

function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const { searchQuery, setSearchQuery, notifications } = useWorkspace()
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((notification) => notification.unread).length

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenuClick} aria-label="Open navigation" type="button">
        <Menu size={20} />
      </button>
      <label className="topbar-search">
        <Search size={17} />
        <input
          aria-label="Search projects"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search projects, tasks..."
          type="search"
          value={searchQuery}
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-right">
        <div className="notification-anchor">
          <button
            className={`icon-button notification-trigger ${showNotifications ? 'icon-button-active' : ''}`}
            onClick={() => setShowNotifications((show) => !show)}
            aria-label={`Notifications, ${unreadCount} unread`}
            type="button"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        </div>
        <Link className="topbar-user" to="/profile">
          <span className={`avatar avatar-${user?.avatarColor || 'lavender'}`}>{user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'AM'}</span>
          <span className="topbar-user-copy"><strong>{user?.name || 'Alex Morgan'}</strong><small>{user?.role || 'Product Designer'}</small></span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
