import type { Project, TimeEntry } from './types';
export function __reset() {}
export function getProjects(): Project[] { return []; }
export function getEntries(): TimeEntry[] { return []; }
export function addEntry(_d: Omit<TimeEntry, 'id'>): TimeEntry { return { id: '', projectId: '', description: '', hours: 0, date: '' }; }
export function deleteEntry(_id: string): boolean { return false; }
export function addProject(_d: Omit<Project, 'id'>): Project | null { return null; }
