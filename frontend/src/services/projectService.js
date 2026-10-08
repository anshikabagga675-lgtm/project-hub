import { mockProjects } from '../data/mockData.js'

export function getProjects() {
  return Promise.resolve(mockProjects)
}

export function createProject(project) {
  return Promise.resolve({ ...project, id: `project-${Date.now()}` })
}
