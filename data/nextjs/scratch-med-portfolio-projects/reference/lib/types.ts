export type Category = 'Web' | 'Mobile' | 'Design'
export type Status = 'Live' | 'Draft'
export type Route = 'projects' | 'stats' | 'settings'
export type Project = { id: number; title: string; category: Category; status: Status }
