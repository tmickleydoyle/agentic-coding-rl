export type Priority = 'High' | 'Med' | 'Low'
export type Route = 'tasks' | 'stats' | 'settings'
export type Task = { id: number; title: string; priority: Priority; done: boolean }
