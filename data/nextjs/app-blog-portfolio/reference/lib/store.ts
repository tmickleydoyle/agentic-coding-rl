import type { Post, Project } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let projects: Project[] = []
let posts: Post[] = []
let nextProjectId = 1

function seed(): void {
  projects = [
    { id: 'j1', title: 'Portfolio site', tags: ['web', 'ts'], featured: true },
    { id: 'j2', title: 'Data pipeline', tags: ['python'], featured: false },
    { id: 'j3', title: 'Game engine', tags: ['cpp', 'web'], featured: false },
  ]
  posts = [
    { id: 'w1', title: 'Why I left Vim', tag: 'web' },
    { id: 'w2', title: 'Typing tricks', tag: 'ts' },
    { id: 'w3', title: 'On profiling', tag: 'python' },
  ]
  nextProjectId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listProjects(filter?: {
  featured?: boolean
  tag?: string | null
}): Project[] {
  let out = projects.slice()
  if (filter?.featured) out = out.filter((p) => p.featured)
  const tag = filter?.tag
  if (tag) out = out.filter((p) => p.tags.includes(tag))
  return out
}

export function listPosts(): Post[] {
  return posts.slice()
}

export function createProject(input: { title: string; tags?: string[] }): Project {
  const project: Project = {
    id: `j${nextProjectId++}`,
    title: input.title,
    tags: input.tags ?? [],
    featured: false,
  }
  projects.push(project)
  return project
}

export function findProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function updateProject(
  id: string,
  patch: { featured?: boolean },
): Project | undefined {
  const project = projects.find((p) => p.id === id)
  if (!project) return undefined
  if (typeof patch.featured === 'boolean') project.featured = patch.featured
  return project
}
