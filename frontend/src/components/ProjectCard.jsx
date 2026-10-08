import { ArrowUpRight, CalendarDays, Check, MoreHorizontal, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatDate(dateString) {
  if (!dateString) return 'No deadline'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${dateString}T12:00:00`))
}

function ProjectCard({ project }) {
  const members = project.members || []
  return (
    <article className="project-card">
      <div className={`project-card-art project-art-${project.color || 'blue'}`}>
        <span className="project-art-orbit orbit-one" />
        <span className="project-art-orbit orbit-two" />
        <span className="project-art-mark">{project.name.slice(0, 1)}</span>
        <button className="project-more icon-button" aria-label={`More about ${project.name}`} type="button">
          <MoreHorizontal size={19} />
        </button>
      </div>
      <div className="project-card-body">
        <div className="project-title-row">
          <h3>{project.name}</h3>
          <span className={`status-pill status-${project.status === 'Planning' ? 'planning' : 'active'}`}>
            <span />{project.status}
          </span>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="progress-heading"><span>Project progress</span><strong>{project.progress || 0}%</strong></div>
        <div className="progress-track"><span style={{ width: `${project.progress || 0}%` }} /></div>
        <div className="project-metrics">
          <span><Check size={14} />{project.completed || 0}/{project.tasks || 0} tasks</span>
          <span><CalendarDays size={14} />{formatDate(project.deadline)}</span>
        </div>
        <div className="project-card-footer">
          <div className="member-stack" aria-label={`${members.length} project members`}>
            {members.slice(0, 3).map((member, index) => (
              <span className={`avatar avatar-${member.color || 'blue'}`} key={member.id || member.name} style={{ zIndex: 3 - index }}>
                {member.initials || member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </span>
            ))}
            {members.length > 3 && <span className="member-overflow">+{members.length - 3}</span>}
          </div>
          <span className="member-count"><Users size={14} />{members.length} members</span>
          <Link className="project-open" to={`/project/${project.id}`} aria-label={`View ${project.name}`}>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
