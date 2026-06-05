export type Route = 'time' | 'projects' | 'reports'
export type Project = { name: string; rate: number }
export type Entry = {
  id: number
  task: string
  project: string
  hours: number
  billable: boolean
}
export const SEED_PROJECTS: Project[] = [
  { name: 'Website', rate: 80 },
  { name: 'Branding', rate: 120 },
  { name: 'App', rate: 150 },
]
