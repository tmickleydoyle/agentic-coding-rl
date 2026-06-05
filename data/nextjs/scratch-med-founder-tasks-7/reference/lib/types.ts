export type Priority = 'High' | 'Medium' | 'Low'
export type Route = 'tasks' | 'stats' | 'settings'
export type Task = { id: number; title: string; priority: Priority; done: boolean }
