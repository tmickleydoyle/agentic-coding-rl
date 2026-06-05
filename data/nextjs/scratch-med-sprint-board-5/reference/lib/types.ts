export type Status = 'todo' | 'doing' | 'done'
export type Route = 'board' | 'stats' | 'settings'
export type Task = { id: number; name: string; points: number; status: Status }
