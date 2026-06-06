import type { Note } from './types';
export function __reset() {}
export function getNotes(): Note[] { return []; }
export function addNote(_d: Omit<Note, 'id'>): Note { return { id: '', title: '', body: '', tags: [], archived: false, createdAt: '', updatedAt: '' }; }
export function deleteNote(_id: string): boolean { return false; }
export function setArchived(_id: string, _archived: boolean): boolean { return false; }
export function getTags(): string[] { return []; }
