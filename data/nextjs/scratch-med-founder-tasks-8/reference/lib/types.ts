export type Priority = 'high' | 'med' | 'low'
export type Route = 'tasks' | 'stats' | 'settings'
export type Task = { id: number; name: string; priority: Priority; done: boolean }
