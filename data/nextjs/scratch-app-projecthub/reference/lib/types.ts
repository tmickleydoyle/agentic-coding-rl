export type Status = 'todo' | 'doing' | 'done'
export type Route = 'board' | 'backlog' | 'reports' | 'settings'
export type Task = { id: number; title: string; status: Status }
export type Idea = { id: number; title: string }
