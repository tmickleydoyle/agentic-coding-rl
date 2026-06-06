import type { Contact, Group } from './types';
export function __reset() {}
export function getContacts(): Contact[] { return []; }
export function getGroups(): Group[] { return []; }
export function addContact(_data: Omit<Contact, 'id'>): Contact | { error: string } { return { error: 'Not implemented' }; }
export function deleteContact(_id: string): boolean { return false; }
export function addGroup(_data: Omit<Group, 'id'>): Group | null { return null; }
export function searchContacts(_query: string): Contact[] { return []; }
