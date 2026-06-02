export type Priority = 'High' | 'Medium' | 'Low'
export type Route = 'tasks' | 'stats' | 'settings'
export type Task = { id: number; name: string; priority: Priority; done: boolean }
