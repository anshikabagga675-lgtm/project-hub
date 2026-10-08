import { FolderOpen } from 'lucide-react'

function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><FolderOpen size={22} /></span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  )
}

export default EmptyState
