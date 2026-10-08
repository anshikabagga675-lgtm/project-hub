import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleCheck, FolderKanban, Plus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import CreateProjectModal from '../components/CreateProjectModal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { useAuth } from '../context/useAuth.js'
import { useWorkspace } from '../context/useWorkspace.js'

const filters = ['All projects', 'In progress', 'Planning']

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Dashboard() {
  const { user } = useAuth()
  const { projects, tasks, searchQuery, addProject } = useWorkspace()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('All projects')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const view = searchParams.get('view') || 'projects'
  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesQuery = `${project.name} ${project.description}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'All projects' || project.status === filter
    return matchesQuery && matchesFilter
  }), [projects, searchQuery, filter])
  const activeTasks = tasks.filter((task) => task.status !== 'Completed').length
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length
  const memberCount = new Set(projects.flatMap((project) => project.members || []).map((member) => member.id || member.name)).size

  const stats = [
    { title: 'Total projects', value: projects.length, change: 'Across your workspace', icon: FolderKanban, color: 'stat-blue' },
    { title: 'Active tasks', value: activeTasks, change: 'Ready for a little progress', icon: CircleCheck, color: 'stat-purple' },
    { title: 'Completed tasks', value: completedTasks, change: 'You’re getting things done', icon: Check, color: 'stat-green' },
    { title: 'Team members', value: memberCount, change: 'Collaborating together', icon: Users, color: 'stat-orange' },
  ]
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date()).toUpperCase()

  return (
    <AppShell>
      <div className="dashboard-page">
        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="welcome-label">{today}</span>
            <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'there'} <span aria-hidden="true">👋</span></h1>
            <p>Here’s what’s happening with your projects.</p>
          </div>
          <div className="welcome-illustration" aria-hidden="true"><span className="welcome-sun" /><span className="welcome-plant plant-one" /><span className="welcome-plant plant-two" /><span className="welcome-ground" /></div>
          <button className="button button-primary create-project-button" onClick={() => setIsCreateOpen(true)} type="button"><Plus size={17} />Create project</button>
        </section>

        <section className="stats-grid" aria-label="Workspace statistics">
          {stats.map(({ title, value, change, icon: Icon, color }) => (
            <article className="stat-card" key={title}>
              <div className="stat-card-top"><span className={`stat-icon ${color}`}><Icon size={17} /></span><span className="stat-ornament">↗</span></div>
              <strong className="stat-value">{value}</strong><span className="stat-title">{title}</span><span className="stat-change">{change}</span>
            </article>
          ))}
        </section>

        {view === 'notifications' ? (
          <section className="dashboard-section">
            <div className="section-heading"><div><span className="section-kicker">STAY IN THE LOOP</span><h2>Notifications</h2></div></div>
            <p className="dashboard-note">Open the bell in the top bar to review your latest updates.</p>
          </section>
        ) : view === 'tasks' ? (
          <section className="dashboard-section">
            <div className="section-heading"><div><span className="section-kicker">YOUR NEXT STEPS</span><h2>Tasks at a glance</h2></div><button className="text-link" onClick={() => setSearchParams({ view: 'projects' })} type="button">View projects <ArrowRight size={15} /></button></div>
            <div className="overview-task-list">{tasks.filter((task) => task.status !== 'Completed').slice(0, 6).map((task) => <div className="overview-task" key={task.id}><span className={`priority-dot priority-${task.priority.toLowerCase()}`} /><span>{task.title}</span><span className="overview-task-project">{projects.find((project) => project.id === task.projectId)?.name}</span><span className="overview-task-status">{task.status}</span></div>)}</div>
          </section>
        ) : (
          <section className="dashboard-section">
            <div className="section-heading project-section-heading">
              <div><span className="section-kicker">MAKE PROGRESS TOGETHER</span><h2>My projects <span className="project-count">{projects.length}</span></h2></div>
              <div className="project-tools">
                <label className="filter-select"><span className="sr-only">Filter projects</span><select onChange={(event) => setFilter(event.target.value)} value={filter}>{filters.map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={15} /></label>
                <button className="button button-outline small-create" onClick={() => setIsCreateOpen(true)} type="button"><Plus size={16} />New project</button>
              </div>
            </div>
            {filteredProjects.length > 0 ? (
              <div className="projects-grid">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
            ) : (
              <EmptyState title="No matching projects" message="Try another search or create a project to get started." action={<button className="button button-outline" onClick={() => { setFilter('All projects'); setSearchParams({ view: 'projects' }) }} type="button">Clear filters</button>} />
            )}
          </section>
        )}

        <section className="activity-strip"><span className="activity-check"><Check size={15} /></span><p><strong>A small win counts.</strong> {completedTasks} tasks completed across your workspace.</p><button className="text-link" onClick={() => setSearchParams({ view: 'tasks' })} type="button">See tasks <ArrowUpRight size={15} /></button></section>
      </div>
      {isCreateOpen && <CreateProjectModal onClose={() => setIsCreateOpen(false)} onCreate={addProject} />}
    </AppShell>
  )
}

export default Dashboard
