import { Bell, CheckCheck, X } from 'lucide-react'
import { useWorkspace } from '../context/useWorkspace.js'

function NotificationPanel({ onClose }) {
  const { notifications, markNotificationsRead } = useWorkspace()
  const unreadCount = notifications.filter((notification) => notification.unread).length

  return (
    <section className="notification-panel" aria-label="Notifications">
      <div className="panel-heading">
        <div>
          <span className="panel-title">Notifications</span>
          <span className="panel-count">{unreadCount} unread</span>
        </div>
        <div className="panel-actions">
          <button className="icon-button small-icon" onClick={markNotificationsRead} title="Mark all as read" type="button">
            <CheckCheck size={16} />
          </button>
          <button className="icon-button small-icon" onClick={onClose} aria-label="Close notifications" type="button">
            <X size={17} />
          </button>
        </div>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <article className={`notification-item ${notification.unread ? 'notification-unread' : ''}`} key={notification.id}>
            <span className={`notification-icon notification-${notification.color}`}><Bell size={15} /></span>
            <div className="notification-copy">
              <strong>{notification.title}</strong>
              <p>{notification.detail}</p>
              <time>{notification.time}</time>
            </div>
            {notification.unread && <span className="unread-dot" />}
          </article>
        ))}
      </div>
      <button className="panel-footer-button" onClick={markNotificationsRead} type="button">
        Mark all as read
      </button>
    </section>
  )
}

export default NotificationPanel
