import { mockTasks } from '../data/mockData.js'

export function getTasks(projectId) {
  const tasks = projectId
    ? mockTasks.filter((task) => task.projectId === projectId)
    : mockTasks
  return Promise.resolve(tasks)
}

export function saveTask(task) {
  return Promise.resolve({ ...task, id: task.id || `task-${Date.now()}` })
}
