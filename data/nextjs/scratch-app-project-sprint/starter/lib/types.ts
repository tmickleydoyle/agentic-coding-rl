export interface Sprint { id: string; name: string; startDate: string; endDate: string; status: 'planning'|'active'|'completed' }
export interface Ticket { id: string; title: string; sprintId: string; sprintName: string; assigneeId: string; assigneeName: string; status: 'open'|'in-progress'|'done'; priority: 'low'|'medium'|'high' }
export interface TeamMember { id: string; name: string; role: string; email: string }
export type Route = 'home'|'sprints'|'tickets'|'team'
export interface AppState { route: Route; setRoute: (r: Route) => void }
