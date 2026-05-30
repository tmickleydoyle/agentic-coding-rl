import type { Post, Project } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `projects`, `posts`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProjects(_filter?: {
  featured?: boolean
  tag?: string | null
}): Project[] {
  // TODO: return projects, applying optional featured + tag filters (AND)
  return []
}

export function listPosts(): Post[] {
  // TODO: return all posts
  return []
}

export function createProject(_input: { title: string; tags?: string[] }): Project {
  // TODO: append a new project with a fresh id (featured false) and return it
  return { id: '', title: '', tags: [], featured: false }
}

export function findProject(_id: string): Project | undefined {
  // TODO: look up a project by id
  return undefined
}

export function updateProject(
  _id: string,
  _patch: { featured?: boolean },
): Project | undefined {
  // TODO: apply the patch and return the updated project, or undefined if absent
  return undefined
}
