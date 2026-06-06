import type { Note } from './types';

const seed: Note[] = [
  { id: 'n1', title: 'Meeting notes', body: 'Discuss Q3 goals', tags: ['work', 'meeting'], archived: false, createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'n2', title: 'Recipe ideas', body: 'Try carbonara', tags: ['personal', 'food'], archived: false, createdAt: '2026-06-02T10:00:00Z', updatedAt: '2026-06-02T10:00:00Z' },
  { id: 'n3', title: 'Old diary', body: '2025 recap', tags: ['personal'], archived: true, createdAt: '2026-06-03T11:00:00Z', updatedAt: '2026-06-03T11:00:00Z' },
  { id: 'n4', title: 'Project plan', body: 'Phase 1 tasks', tags: ['work'], archived: false, createdAt: '2026-06-04T12:00:00Z', updatedAt: '2026-06-04T12:00:00Z' },
];

let notes: Note[] = seed.map(n => ({ ...n, tags: [...n.tags] }));
let nextId = 5;

export function __reset() {
  notes = seed.map(n => ({ ...n, tags: [...n.tags] }));
  nextId = 5;
}

export function getNotes(): Note[] { return notes.slice(); }

export function addNote(data: Omit<Note, 'id'>): Note {
  const n: Note = { id: `n${nextId++}`, ...data };
  notes.push(n);
  return n;
}

export function deleteNote(id: string): boolean {
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return false;
  notes.splice(idx, 1);
  return true;
}

export function setArchived(id: string, archived: boolean): boolean {
  const n = notes.find(n => n.id === id);
  if (!n) return false;
  n.archived = archived;
  n.updatedAt = new Date().toISOString();
  return true;
}

export function getTags(): string[] {
  const set = new Set<string>();
  notes.forEach(n => n.tags.forEach(t => set.add(t)));
  return Array.from(set).sort();
}
