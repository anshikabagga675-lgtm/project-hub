import { ArrowLeft, CalendarDays, Plus, UserPlus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import CommentSection from '../components/CommentSection.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TaskCard from '../components/TaskCard.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { teamMembers } from '../data/mockData.js'
import { useWorkspace } from '../context/useWorkspace.js'

const columns = [
  { status: 'To Do', color: 'todo' },
  { status: 'In Progress', color: 'progress' },
  { status: 'Review', color: 'review' },
  { status: 'Completed', color: 'completed' },
]

function ProjectDetails() {
  const { id } = useParams()
  const { projects, tasks, addTask, updateTask, deleteTask, addComment, updateProject } = useWorkspace()
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [discussionTaskId, setDiscussionTaskId] = useState('')
  const project = projects.find((item) => item.id === id)
  const projectTasks = useMemo(() => tasks.filter((task) => task.projectId === id), [tasks, id])
  const discussionTask = projectTasks.find((task) => task.id === discussionTaskId) || projectTasks[0]

  if (!project) return <Navigate to="/dashboard" replace />

  const deadline = project.deadline
    ? new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${project.deadline}T12:00:00`))
    : 'No deadline set'

  function handleAddMember() {
    const available = teamMembers.filter((member) => !(project.members || []).some((item) => item.id === member.id))
    if (!available.length) {
      window.alert('Everyone on the sample team is already a member.')
      return
    }
    const choice = window.prompt(`Add a teammate by name:\n${available.map((member) => member.name).join('\n')}`, available[0].name)
    if (!choice) return
    const member = available.find((item) => item.name.toLowerCase() === choice.trim().toLowerCase())
    if (!member) {
      window.alert('Choose a name from the sample team list.')
      return
    }
    updateProject(project.id, { members: [...(project.members || []), member] })
  }

  function handleSaveTask(task) {
    if (task.id) updateTask(task.id, task)
    else addTask(task)
  }

  return (
    <AppShell>
      <div className="project-details-page">
        <Link className="back-link" to="/dashboard"><ArrowLeft size={16} />Back to dashboard</Link>
        <section className={`project-detail-hero project-hero-${project.color || 'blue'}`}>
          <div className="project-detail-copy">
            <span className="section-kicker">PROJECT WORKSPACE</span>
            <h1>{project.name}</h1>
            <p>{project.description || 'A shared space for your team to make progress.'}</p>
            <div className="project-detail-meta"><span><CalendarDays size={15} />Due {deadline}</span><span><Users size={15} />{project.members?.length || 0} members</span></div>
          </div>
          <div className="detail-members">
            <div className="member-stack">{(project.members || []).slice(0, 4).map((member, index) => <span className={`avatar avatar-${member.color || 'blue'}`} key={member.id || member.name} style={{ zIndex: 4 - index }}>{member.initials || member.name.slice(0, 2).toUpperCase()}</span>)}</div>
            <button className="button button-outline member-button" onClick={handleAddMember} type="button"><UserPlus size={15} />Add member</button>
          </div>
        </section>

        <div className="board-heading"><div><span className="section-kicker">KEEP THE MOMENTUM</span><h2>Project board <span className="project-count">{projectTasks.length}</span></h2></div><button className="button button-primary" onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true) }} type="button"><Plus size={17} />Add task</button></div>

        <section className="kanban-board" aria-label="Project tasks by status">
          {columns.map(({ status, color }) => {
            const columnTasks = projectTasks.filter((task) => task.status === status)
            return (
              <div className="kanban-column" key={status}>
                <div className="kanban-column-heading"><span className={`column-indicator indicator-${color}`} /><h3>{status}</h3><span className="column-count">{columnTasks.length}</span></div>
                <div className="kanban-cards">
                  {columnTasks.map((task) => <TaskCard key={task.id} onDelete={deleteTask} onEdit={(item) => { setTaskToEdit(item); setIsTaskModalOpen(true) }} task={task} />)}
                  {columnTasks.length === 0 && <div className="column-empty">No tasks yet</div>}
                </div>
                <button className="column-add" onClick={() => { setTaskToEdit({ status }); setIsTaskModalOpen(true) }} type="button"><Plus size={15} />Add a task</button>
              </div>
            )
          })}
        </section>

        <section className="project-discussion">
          <div className="discussion-heading"><div><span className="section-kicker">TEAM CONVERSATION</span><h2>Task discussion</h2></div>{projectTasks.length > 0 && <select aria-label="Select task discussion" onChange={(event) => setDiscussionTaskId(event.target.value)} value={discussionTask?.id || ''}>{projectTasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select>}</div>
          {discussionTask ? <CommentSection comments={discussionTask.comments || []} onAddComment={(comment) => addComment(discussionTask.id, comment)} /> : <EmptyState title="Add a task to start a discussion" message="Comments keep decisions and updates close to the work." />}
        </section>
      </div>
      {isTaskModalOpen && <TaskModal onClose={() => setIsTaskModalOpen(false)} onDelete={deleteTask} onSave={handleSaveTask} projectId={project.id} task={taskToEdit} />}
    </AppShell>
  )
}

export default ProjectDetails
