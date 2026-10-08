import { X } from 'lucide-react'
import { useState } from 'react'
import useEscapeKey from '../hooks/useEscapeKey.js'

function CreateProjectModal({ onClose, onCreate }) {
  useEscapeKey(onClose)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState('Planning')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give your project a name to continue.')
      return
    }
    setIsSaving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    onCreate({
      name: name.trim(),
      description: description.trim(),
      deadline,
      status,
      progress: 0,
      color: ['blue', 'purple', 'orange', 'green'][Date.now() % 4],
      members: [],
    })
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" aria-labelledby="create-project-title" aria-modal="true" role="dialog">
        <div className="modal-heading">
          <div><span className="modal-kicker">NEW WORKSPACE</span><h2 id="create-project-title">Create a project</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal" type="button"><X size={19} /></button>
        </div>
        <p className="modal-intro">Give your team a shared place to make progress.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="form-field">Project name<input autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} placeholder="e.g. Website Redesign" required value={name} /></label>
          <label className="form-field">Description<textarea maxLength={240} onChange={(event) => setDescription(event.target.value)} placeholder="What are you working on?" rows="3" value={description} /></label>
          <div className="form-grid">
            <label className="form-field">Deadline<input onChange={(event) => setDeadline(event.target.value)} type="date" value={deadline} /></label>
            <label className="form-field">Status<select onChange={(event) => setStatus(event.target.value)} value={status}><option>Planning</option><option>In progress</option></select></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button className="button button-quiet" onClick={onClose} type="button">Cancel</button><button className="button button-primary" disabled={isSaving} type="submit">{isSaving ? 'Creating…' : 'Create project'}</button></div>
        </form>
      </section>
    </div>
  )
}

export default CreateProjectModal
