import { useState } from 'react'
import { mockProjects, mockTasks, mockNotifications } from '../data/mockData.js'

import { WorkspaceContext } from './workspaceContext.js'

export function WorkspaceProvider({ children }) {
  const [projects, setProjects] = useState(mockProjects)
  const [tasks, setTasks] = useState(mockTasks)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState('')

  function addProject(project) {
    const newProject = {
      ...project,
      id: `project-${Date.now()}`,
      members: project.members || [],
      tasks: 0,
      completed: 0,
      color: project.color || 'blue',
    }
    setProjects((current) => [newProject, ...current])
    return newProject
  }

  function updateProject(projectId, updates) {
    setProjects((current) => current.map((project) =>
      project.id === projectId ? { ...project, ...updates } : project,
    ))
  }

  function addTask(task) {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      comments: [],
    }
    setTasks((current) => [...current, newTask])
    setProjects((current) => current.map((project) =>
      project.id === task.projectId
        ? { ...project, tasks: (project.tasks || 0) + 1 }
        : project,
    ))
  }

  function updateTask(taskId, updates) {
    setTasks((current) => current.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task,
    ))
  }

  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId)
    setTasks((current) => current.filter((item) => item.id !== taskId))
    if (task) {
      setProjects((current) => current.map((project) =>
        project.id === task.projectId
          ? { ...project, tasks: Math.max((project.tasks || 0) - 1, 0) }
          : project,
      ))
    }
  }

  function addComment(taskId, comment) {
    const newComment = {
      id: `comment-${Date.now()}`,
      ...comment,
      createdAt: new Date().toISOString(),
    }
    setTasks((current) => current.map((task) =>
      task.id === taskId
        ? { ...task, comments: [...(task.comments || []), newComment] }
        : task,
    ))
  }

  function markNotificationsRead() {
    setNotifications((current) => current.map((notification) => ({
      ...notification,
      unread: false,
    })))
  }

  const value = {
    projects,
    tasks,
    notifications,
    searchQuery,
    setSearchQuery,
    addProject,
    updateProject,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    markNotificationsRead,
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
