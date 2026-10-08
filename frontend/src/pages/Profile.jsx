import { ArrowUpRight, BriefcaseBusiness, Check, Mail, Pencil, UserRound } from 'lucide-react'
import { useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { useAuth } from '../context/useAuth.js'
import { useWorkspace } from '../context/useWorkspace.js'

function Profile() {
  const { user, updateProfile } = useAuth()
  const { projects, tasks } = useWorkspace()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)

  function handleSave(event) {
    event.preventDefault()
    if (name.trim()) {
      updateProfile({ name: name.trim() })
      setIsEditing(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    }
  }

  return (
    <AppShell>
      <div className="profile-page">
        <div className="page-heading"><div><span className="section-kicker">YOUR SPACE</span><h1>Profile</h1><p>Make your workspace feel a little more like you.</p></div></div>
        <section className="profile-card">
          <div className="profile-cover"><span className="profile-cover-shape shape-a" /><span className="profile-cover-shape shape-b" /></div>
          <div className="profile-main">
            <div className={`avatar avatar-profile avatar-${user?.avatarColor || 'lavender'}`}>{user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'AM'}</div>
            <div className="profile-info">
              {isEditing ? (
                <form className="profile-edit-form" onSubmit={handleSave}><label className="form-field">Display name<input autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} required value={name} /></label><button className="button button-primary" type="submit">Save changes</button><button className="button button-quiet" onClick={() => { setName(user?.name || ''); setIsEditing(false) }} type="button">Cancel</button></form>
              ) : <><h2>{user?.name || 'Alex Morgan'}</h2><p>{user?.role || 'Product Designer'}</p></>}
              <div className="profile-email"><Mail size={15} />{user?.email}</div>
            </div>
            {!isEditing && <button className="button button-outline profile-edit-button" onClick={() => setIsEditing(true)} type="button"><Pencil size={15} />Edit profile</button>}
          </div>
          <div className="profile-stats"><div><span><BriefcaseBusiness size={17} /></span><strong>{projects.length}</strong><small>Projects</small></div><div><span><Check size={17} /></span><strong>{tasks.filter((task) => task.status === 'Completed').length}</strong><small>Tasks completed</small></div><div><span><UserRound size={17} /></span><strong>{new Set(projects.flatMap((project) => project.members || []).map((member) => member.id || member.name)).size}</strong><small>Team members</small></div></div>
        </section>
        <div className={`profile-saved ${saved ? 'profile-saved-visible' : ''}`} role="status">Profile updated <Check size={15} /></div>
        <section className="profile-preferences"><div><div className="preference-icon"><ArrowUpRight size={18} /></div><div><strong>Make progress visible</strong><p>Your profile is part of your team workspace.</p></div></div><span className="preference-badge">ALL SET</span></section>
      </div>
    </AppShell>
  )
}

export default Profile
