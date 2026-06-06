import type { Task, Label } from './types';
export function __reset() {}
export function getTasks(): Task[] { return []; }
export function getLabels(): Label[] { return []; }
export function addTask(_d: Omit<Task, 'id'>): Task { return { id: '', title: '', description: '', status: 'todo', label: '', priority: 'medium' }; }
export function moveForward(_id: string): boolean { return false; }
export function reopenTask(_id: string): boolean { return false; }
export function addLabel(_d: Omit<Label, 'id'>): Label | null { return null; }
