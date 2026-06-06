export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export interface Task { id: string; title: string; description: string; status: TaskStatus; label: string; priority: Priority; }
export interface Label { id: string; name: string; }
export type Route = 'home' | 'board' | 'completed' | 'settings';
