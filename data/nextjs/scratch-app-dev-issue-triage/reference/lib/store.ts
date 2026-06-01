import type { Issue, IssueStatus, Priority } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let issues: Issue[] = []
let nextIssueId = 1

function seed(): void {
  issues = [
    { id: 'i1', title: 'Login button broken', labels: ['bug', 'ui'], priority: 'high', assignee: 'alice', status: 'open' },
    { id: 'i2', title: 'Slow dashboard query', labels: ['bug', 'perf'], priority: 'medium', assignee: null, status: 'in-progress' },
    { id: 'i3', title: 'Add dark mode', labels: ['feature', 'ui'], priority: 'low', assignee: 'bob', status: 'open' },
    { id: 'i4', title: 'Typo in footer', labels: ['ui'], priority: 'low', assignee: null, status: 'closed' },
  ]
  nextIssueId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listIssues(filter?: {
  label?: string | null
  priority?: string | null
  assignee?: string | null
}): Issue[] {
  let out = issues.slice()
  const label = filter?.label
  if (label) out = out.filter((i) => i.labels.indexOf(label) !== -1)
  const priority = filter?.priority
  if (priority === 'low' || priority === 'medium' || priority === 'high') {
    out = out.filter((i) => i.priority === priority)
  }
  const assignee = filter?.assignee
  if (assignee === 'unassigned') out = out.filter((i) => i.assignee === null)
  else if (assignee) out = out.filter((i) => i.assignee === assignee)
  return out
}

export function createIssue(input: {
  title: string
  labels?: string[]
  priority?: Priority
  assignee?: string | null
}): Issue {
  const issue: Issue = {
    id: `i${nextIssueId++}`,
    title: input.title,
    labels: input.labels ?? [],
    priority: input.priority ?? 'medium',
    assignee: input.assignee ?? null,
    status: 'open',
  }
  issues.push(issue)
  return issue
}

export function findIssue(id: string): Issue | undefined {
  return issues.find((i) => i.id === id)
}

export function updateIssue(
  id: string,
  patch: { assignee?: string | null; priority?: Priority; status?: IssueStatus; labels?: string[] },
): Issue | undefined {
  const issue = issues.find((i) => i.id === id)
  if (!issue) return undefined
  if (patch.assignee !== undefined) issue.assignee = patch.assignee
  if (patch.priority) issue.priority = patch.priority
  if (patch.status) issue.status = patch.status
  if (patch.labels) issue.labels = patch.labels
  return issue
}

export function deleteIssue(id: string): boolean {
  const idx = issues.findIndex((i) => i.id === id)
  if (idx === -1) return false
  issues.splice(idx, 1)
  return true
}
