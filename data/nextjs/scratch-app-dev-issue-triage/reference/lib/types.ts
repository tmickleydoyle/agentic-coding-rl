export type Priority = 'low' | 'medium' | 'high'

export type IssueStatus = 'open' | 'in-progress' | 'closed'

export type Issue = {
  id: string
  title: string
  labels: string[]
  priority: Priority
  assignee: string | null
  status: IssueStatus
}

export type LabelFilter = 'all' | string
export type PriorityFilter = 'all' | Priority
export type AssigneeFilter = 'all' | 'unassigned' | string

export type Route = 'issues' | 'issue-detail' | 'triage' | 'board'
export type Theme = 'light' | 'dark'
