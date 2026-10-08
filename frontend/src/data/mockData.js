export const teamMembers = [
  { id: 'u1', name: 'Alex Morgan', initials: 'AM', color: 'lavender' },
  { id: 'u2', name: 'Sarah Chen', initials: 'SC', color: 'peach' },
  { id: 'u3', name: 'Rahul Patel', initials: 'RP', color: 'mint' },
  { id: 'u4', name: 'Maya Johnson', initials: 'MJ', color: 'sky' },
]

export const mockProjects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'A fresh, thoughtful digital experience for our next chapter.',
    deadline: '2026-11-12',
    status: 'In progress',
    progress: 68,
    tasks: 24,
    completed: 16,
    color: 'blue',
    members: teamMembers.slice(0, 3),
  },
  {
    id: 'p2',
    name: 'PharmaLoop',
    description: 'Making healthcare coordination feel effortless.',
    deadline: '2026-11-25',
    status: 'In progress',
    progress: 42,
    tasks: 19,
    completed: 8,
    color: 'purple',
    members: teamMembers.slice(1, 4),
  },
  {
    id: 'p3',
    name: 'Study Flow',
    description: 'A calmer way for students to plan and focus.',
    deadline: '2026-12-04',
    status: 'Planning',
    progress: 24,
    tasks: 12,
    completed: 3,
    color: 'orange',
    members: [teamMembers[0], teamMembers[3]],
  },
  {
    id: 'p4',
    name: 'Project Hub',
    description: 'One shared space for teams to do their best work.',
    deadline: '2026-12-18',
    status: 'In progress',
    progress: 76,
    tasks: 32,
    completed: 24,
    color: 'green',
    members: teamMembers,
  },
]

export const mockTasks = [
  { id: 't1', projectId: 'p1', title: 'Create landing page', description: 'Build the new responsive homepage and hero section.', assignee: teamMembers[1], priority: 'High', status: 'In Progress', dueDate: '2026-10-18', comments: [{ id: 'c1', author: 'Rahul Patel', initials: 'RP', color: 'mint', text: 'I added the latest copy to the shared doc.', createdAt: '2026-10-07T09:20:00' }] },
  { id: 't2', projectId: 'p1', title: 'Design dashboard', description: 'Explore the dashboard layout and data visualizations.', assignee: teamMembers[0], priority: 'Urgent', status: 'Review', dueDate: '2026-10-16', comments: [] },
  { id: 't3', projectId: 'p1', title: 'Audit existing components', description: 'Document reusable patterns from the current product.', assignee: teamMembers[2], priority: 'Medium', status: 'To Do', dueDate: '2026-10-22', comments: [] },
  { id: 't4', projectId: 'p1', title: 'Mobile navigation', description: 'Polish the navigation for small screens.', assignee: teamMembers[3], priority: 'Low', status: 'Completed', dueDate: '2026-10-12', comments: [] },
  { id: 't5', projectId: 'p2', title: 'Connect MongoDB', description: 'Set up data models for clinics and appointments.', assignee: teamMembers[2], priority: 'High', status: 'In Progress', dueDate: '2026-10-20', comments: [] },
  { id: 't6', projectId: 'p2', title: 'Implement authentication', description: 'Add secure sign-in for providers and patients.', assignee: teamMembers[0], priority: 'Urgent', status: 'To Do', dueDate: '2026-10-19', comments: [] },
  { id: 't7', projectId: 'p2', title: 'Create project API', description: 'Document initial REST endpoints.', assignee: teamMembers[1], priority: 'Medium', status: 'Review', dueDate: '2026-10-25', comments: [] },
  { id: 't8', projectId: 'p3', title: 'Fix responsive layout', description: 'Review tablet and mobile breakpoints.', assignee: teamMembers[3], priority: 'Low', status: 'To Do', dueDate: '2026-10-28', comments: [] },
  { id: 't9', projectId: 'p4', title: 'Build project overview', description: 'Add progress cards and the project activity feed.', assignee: teamMembers[0], priority: 'High', status: 'Completed', dueDate: '2026-10-11', comments: [] },
]

export const mockNotifications = [
  { id: 'n1', title: 'Sarah assigned you a task', detail: 'Create landing page · Website Redesign', time: '12 min ago', unread: true, color: 'purple' },
  { id: 'n2', title: 'Rahul commented on your task', detail: '“I added the latest copy to the shared doc.”', time: '1 hour ago', unread: true, color: 'blue' },
  { id: 'n3', title: 'Project deadline is tomorrow', detail: 'Design dashboard · Website Redesign', time: '3 hours ago', unread: true, color: 'orange' },
  { id: 'n4', title: 'New member joined your project', detail: 'Maya joined Study Flow', time: 'Yesterday', unread: false, color: 'green' },
]
