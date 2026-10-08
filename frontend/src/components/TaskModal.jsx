import { Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { teamMembers } from '../data/mockData.js'
import useEscapeKey from '../hooks/useEscapeKey.js'

const statuses = ['To Do', 'In Progress', 'Review', 'Completed']
const priorities = ['Low', 'Medium', 'High', 'Urgent']

function TaskModal({ task, projectId, onClose, onSave, onDelete }) {
  useEscapeKey(onClose)
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [assigneeId, setAssigneeId] = useState(task?.assignee?.id || '')
  const [priority, setPriority] = useState(task?.priority || 'Medium')
  const [status, setStatus] = useState(task?.status || 'To Do')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Task title is required.')
      return
    }
    const assignee = teamMembers.find((member) => member.id === assigneeId) || null
    onSave({
      ...(task || {}),
      projectId: task?.projectId || projectId,
      title: title.trim(),
      description: description.trim(),
      assignee,
      priority,
      status,
      dueDate,
    })
    onClose()
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      onDelete(task.id)
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card task-modal" aria-labelledby="task-modal-title" aria-modal="true" role="dialog">
        <div className="modal-heading">
          <div><span className="modal-kicker">{task ? 'TASK DETAILS' : 'ADD TO YOUR BOARD'}</span><h2 id="task-modal-title">{task ? 'Edit task' : 'Create a task'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal" type="button"><X size={19} /></button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="form-field">Task title<input autoFocus maxLength={120} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to get done?" required value={title} /></label>
          <label className="form-field">Description<textarea maxLength={500} onChange={(event) => setDescription(event.target.value)} placeholder="Add a few details..." rows="3" value={description} /></label>
          <div className="form-grid form-grid-two">
            <label className="form-field">Assignee<select onChange={(event) => setAssigneeId(event.target.value)} value={assigneeId}><option value="">Unassigned</option>{teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
            <label className="form-field">Priority<select onChange={(event) => setPriority(event.target.value)} value={priority}>{priorities.map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <div className="form-grid form-grid-two">
            <label className="form-field">Status<select onChange={(event) => setStatus(event.target.value)} value={status}>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className="form-field">Due date<input onChange={(event) => setDueDate(event.target.value)} type="date" value={dueDate} /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions modal-actions-split">
            {task && <button className="button button-danger-quiet" onClick={handleDelete} type="button"><Trash2 size={15} />Delete task</button>}
            <span />
            <button className="button button-quiet" onClick={onClose} type="button">Cancel</button>
            <button className="button button-primary" type="submit">Save task</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TaskModal
