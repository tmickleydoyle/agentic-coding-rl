export type Route = 'releases' | 'tickets' | 'readiness'
export type Release = { id: number; name: string }
export type Ticket = {
  id: number
  summary: string
  releaseId: number
  points: number
  done: boolean
}
