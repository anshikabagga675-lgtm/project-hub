import { CalendarDays, MessageCircle, Pencil, Trash2 } from 'lucide-react'

function TaskCard({ task, onEdit, onDelete }) {
  const assignee = task.assignee
  const initials = assignee?.initials || assignee?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'NA'
  const dueDate = task.dueDate
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${task.dueDate}T12:00:00`))
    : 'No date'

  function confirmDelete() {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) onDelete(task.id)
  }

  return (
    <article className="task-card">
      <div className="task-card-heading">
        <span className={`priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span>
        <div className="task-actions">
          <button className="task-icon-button" onClick={() => onEdit(task)} title="Edit task" type="button"><Pencil size={14} /></button>
          <button className="task-icon-button task-delete" onClick={confirmDelete} title="Delete task" type="button"><Trash2 size={14} /></button>
        </div>
      </div>
      <h4>{task.title}</h4>
      <p className="task-description">{task.description || 'No description provided.'}</p>
      <div className="task-card-footer">
        <div className="task-assignee">
          <span className={`avatar avatar-small avatar-${assignee?.color || 'blue'}`}>{initials}</span>
          <span>{assignee?.name || 'Unassigned'}</span>
        </div>
        <div className="task-meta">
          <span><CalendarDays size={13} />{dueDate}</span>
          <span><MessageCircle size={13} />{task.comments?.length || 0}</span>
        </div>
      </div>
    </article>
  )
}

export default TaskCard
