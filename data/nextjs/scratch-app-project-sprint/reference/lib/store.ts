import { Sprint, Ticket, TeamMember } from './types'
let sprints: Sprint[] = [
  { id: 'sp1', name: 'Sprint 1', startDate: '2024-06-01', endDate: '2024-06-14', status: 'active' },
  { id: 'sp2', name: 'Sprint 2', startDate: '2024-06-15', endDate: '2024-06-28', status: 'planning' },
]
let team: TeamMember[] = [
  { id: 't1', name: 'Dev Dan', role: 'Developer', email: 'dan@team.com' },
  { id: 't2', name: 'PM Paula', role: 'Product Manager', email: 'paula@team.com' },
  { id: 't3', name: 'QA Quinn', role: 'QA Engineer', email: 'quinn@team.com' },
]
let tickets: Ticket[] = [
  { id: 'tk1', title: 'Fix login bug', sprintId: 'sp1', sprintName: 'Sprint 1', assigneeId: 't1', assigneeName: 'Dev Dan', status: 'open', priority: 'high' },
  { id: 'tk2', title: 'Add dark mode', sprintId: 'sp1', sprintName: 'Sprint 1', assigneeId: 't1', assigneeName: 'Dev Dan', status: 'in-progress', priority: 'medium' },
  { id: 'tk3', title: 'Write test plan', sprintId: 'sp2', sprintName: 'Sprint 2', assigneeId: 't3', assigneeName: 'QA Quinn', status: 'open', priority: 'medium' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getSprints() { return [...sprints] }
export function addSprint(d: Omit<Sprint,'id'>): Sprint { const s = { id: uid(), ...d }; sprints.push(s); return s }
export function updateSprintStatus(id: string, status: Sprint['status']): boolean {
  const s = sprints.find(x=>x.id===id); if(!s) return false; s.status=status; return true
}
export function getTickets() { return [...tickets] }
export function addTicket(d: Omit<Ticket,'id'>): Ticket { const t = { id: uid(), ...d }; tickets.push(t); return t }
export function updateTicketStatus(id: string, status: Ticket['status']): boolean {
  const t = tickets.find(x=>x.id===id); if(!t) return false; t.status=status; return true
}
export function getTeam() { return [...team] }
export function addTeamMember(d: Omit<TeamMember,'id'>): TeamMember { const m = { id: uid(), ...d }; team.push(m); return m }
export function __reset() {
  sprints = [
    { id: 'sp1', name: 'Sprint 1', startDate: '2024-06-01', endDate: '2024-06-14', status: 'active' },
    { id: 'sp2', name: 'Sprint 2', startDate: '2024-06-15', endDate: '2024-06-28', status: 'planning' },
  ]
  team = [
    { id: 't1', name: 'Dev Dan', role: 'Developer', email: 'dan@team.com' },
    { id: 't2', name: 'PM Paula', role: 'Product Manager', email: 'paula@team.com' },
    { id: 't3', name: 'QA Quinn', role: 'QA Engineer', email: 'quinn@team.com' },
  ]
  tickets = [
    { id: 'tk1', title: 'Fix login bug', sprintId: 'sp1', sprintName: 'Sprint 1', assigneeId: 't1', assigneeName: 'Dev Dan', status: 'open', priority: 'high' },
    { id: 'tk2', title: 'Add dark mode', sprintId: 'sp1', sprintName: 'Sprint 1', assigneeId: 't1', assigneeName: 'Dev Dan', status: 'in-progress', priority: 'medium' },
    { id: 'tk3', title: 'Write test plan', sprintId: 'sp2', sprintName: 'Sprint 2', assigneeId: 't3', assigneeName: 'QA Quinn', status: 'open', priority: 'medium' },
  ]
  nextId = 100
}
