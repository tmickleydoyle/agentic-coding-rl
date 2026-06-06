import type { Task, Label, TaskStatus } from './types';

const seedLabels: Label[] = [
  { id: 'l1', name: 'Bug' }, { id: 'l2', name: 'Feature' }, { id: 'l3', name: 'Docs' },
];

const seedTasks: Task[] = [
  { id: 't1', title: 'Fix login bug', description: "Users can't log in", status: 'todo', label: 'Bug', priority: 'high' },
  { id: 't2', title: 'Add dark mode', description: 'Theme toggle', status: 'inprogress', label: 'Feature', priority: 'medium' },
  { id: 't3', title: 'Update README', description: 'Add setup guide', status: 'done', label: 'Docs', priority: 'low' },
  { id: 't4', title: 'Write unit tests', description: 'Cover auth module', status: 'todo', label: 'Feature', priority: 'high' },
];

let labels: Label[] = seedLabels.map(l => ({ ...l }));
let tasks: Task[] = seedTasks.map(t => ({ ...t }));
let nextLabelId = 4;
let nextTaskId = 5;

export function __reset() {
  labels = seedLabels.map(l => ({ ...l }));
  tasks = seedTasks.map(t => ({ ...t }));
  nextLabelId = 4;
  nextTaskId = 5;
}

export function getLabels(): Label[] { return labels.slice(); }
export function getTasks(): Task[] { return tasks.slice(); }

export function addTask(data: Omit<Task, 'id'>): Task {
  const t: Task = { id: `t${nextTaskId++}`, ...data };
  tasks.push(t);
  return t;
}

export function moveForward(id: string): boolean {
  const t = tasks.find(t => t.id === id);
  if (!t) return false;
  const next: Record<string, TaskStatus> = { todo: 'inprogress', inprogress: 'done' };
  if (next[t.status]) { t.status = next[t.status]; return true; }
  return false;
}

export function reopenTask(id: string): boolean {
  const t = tasks.find(t => t.id === id);
  if (!t || t.status !== 'done') return false;
  t.status = 'todo';
  return true;
}

export function addLabel(data: Omit<Label, 'id'>): Label | null {
  if (labels.some(l => l.name.toLowerCase() === data.name.toLowerCase())) return null;
  const l: Label = { id: `l${nextLabelId++}`, ...data };
  labels.push(l);
  return l;
}
