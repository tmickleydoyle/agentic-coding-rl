export type Priority = 'high' | 'med' | 'low'
export type Route = 'tasks' | 'stats' | 'settings'
export type Task = { id: number; title: string; priority: Priority; done: boolean }
