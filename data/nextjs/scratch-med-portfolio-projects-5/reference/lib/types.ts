export type Category = 'Web' | 'Mobile' | 'Design' | 'Other'
export type StatusType = 'Live' | 'Draft'
export type Route = 'projects' | 'stats' | 'settings'
export type Project = { id: number; title: string; category: Category; status: StatusType }
