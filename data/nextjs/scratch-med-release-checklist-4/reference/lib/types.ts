export type Task = { id: number; name: string; owner: string; done: boolean }
export type Route = 'checklist' | 'summary' | 'settings'
export type Filter = 'All' | 'Pending' | 'Completed'
