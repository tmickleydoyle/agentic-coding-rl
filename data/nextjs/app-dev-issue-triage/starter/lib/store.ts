import type { Issue, IssueStatus, Priority } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `issues` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listIssues(_filter?: {
  label?: string | null
  priority?: string | null
  assignee?: string | null
}): Issue[] {
  // TODO: return issues, applying optional label + priority + assignee filters
  return []
}

export function createIssue(_input: {
  title: string
  labels?: string[]
  priority?: Priority
  assignee?: string | null
}): Issue {
  // TODO: append a new open issue with a fresh id and return it
  return { id: '', title: '', labels: [], priority: 'medium', assignee: null, status: 'open' }
}

export function findIssue(_id: string): Issue | undefined {
  // TODO: look up an issue by id
  return undefined
}

export function updateIssue(
  _id: string,
  _patch: { assignee?: string | null; priority?: Priority; status?: IssueStatus; labels?: string[] },
): Issue | undefined {
  // TODO: apply the patch and return the updated issue, or undefined if absent
  return undefined
}

export function deleteIssue(_id: string): boolean {
  // TODO: remove the issue; return whether it existed
  return false
}
