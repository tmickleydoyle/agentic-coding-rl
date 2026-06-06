import type { Project, TimeEntry } from './types';

const seedProjects: Project[] = [
  { id: 'p1', name: 'Website Redesign', color: '#3b82f6' },
  { id: 'p2', name: 'Mobile App', color: '#10b981' },
  { id: 'p3', name: 'API Integration', color: '#f59e0b' },
];

const seedEntries: TimeEntry[] = [
  { id: 'te1', projectId: 'p1', description: 'Homepage layout', hours: 3, date: '2026-06-01' },
  { id: 'te2', projectId: 'p2', description: 'Login screen', hours: 2, date: '2026-06-02' },
  { id: 'te3', projectId: 'p1', description: 'Navigation design', hours: 1.5, date: '2026-06-03' },
  { id: 'te4', projectId: 'p3', description: 'Auth endpoints', hours: 4, date: '2026-06-04' },
];

let projects: Project[] = seedProjects.map(p => ({ ...p }));
let entries: TimeEntry[] = seedEntries.map(e => ({ ...e }));
let nextProjectId = 4;
let nextEntryId = 5;

export function __reset() {
  projects = seedProjects.map(p => ({ ...p }));
  entries = seedEntries.map(e => ({ ...e }));
  nextProjectId = 4;
  nextEntryId = 5;
}

export function getProjects(): Project[] { return projects.slice(); }
export function getEntries(): TimeEntry[] { return entries.slice(); }

export function addEntry(data: Omit<TimeEntry, 'id'>): TimeEntry {
  const e: TimeEntry = { id: `te${nextEntryId++}`, ...data };
  entries.push(e);
  return e;
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) return false;
  entries.splice(idx, 1);
  return true;
}

export function addProject(data: Omit<Project, 'id'>): Project | null {
  if (projects.some(p => p.name.toLowerCase() === data.name.toLowerCase())) return null;
  const p: Project = { id: `p${nextProjectId++}`, ...data };
  projects.push(p);
  return p;
}
