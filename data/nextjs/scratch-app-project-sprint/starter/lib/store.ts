import { Sprint, Ticket, TeamMember } from './types'
export function getSprints(): Sprint[] { return [] }
export function addSprint(_d: Omit<Sprint,'id'>): Sprint { return { id:'',name:'',startDate:'',endDate:'',status:'planning' } }
export function updateSprintStatus(_id: string, _status: Sprint['status']): boolean { return false }
export function getTickets(): Ticket[] { return [] }
export function addTicket(_d: Omit<Ticket,'id'>): Ticket { return { id:'',title:'',sprintId:'',sprintName:'',assigneeId:'',assigneeName:'',status:'open',priority:'medium' } }
export function updateTicketStatus(_id: string, _status: Ticket['status']): boolean { return false }
export function getTeam(): TeamMember[] { return [] }
export function addTeamMember(_d: Omit<TeamMember,'id'>): TeamMember { return { id:'',name:'',role:'',email:'' } }
export function __reset() {}
