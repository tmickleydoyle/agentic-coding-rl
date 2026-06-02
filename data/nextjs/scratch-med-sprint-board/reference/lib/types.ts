export type Status = 'todo' | 'doing' | 'done'
export type Route = 'board' | 'stats' | 'settings'
export type Task = { id: number; title: string; points: number; status: Status }
