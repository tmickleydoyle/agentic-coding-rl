export type Route = 'incidents' | 'board' | 'sla'
export type Priority = 'P1' | 'P2'
export type Incident = {
  id: number
  title: string
  priority: Priority
  hours: number
  active: boolean
}
export const SLA_TARGET: Record<Priority, number> = { P1: 4, P2: 24 }
export const PRIORITIES: Priority[] = ['P1', 'P2']
