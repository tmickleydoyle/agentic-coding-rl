import type { Contact, Group } from './types';

const seedGroups: Group[] = [
  { id: 'g1', name: 'Friends' },
  { id: 'g2', name: 'Work' },
  { id: 'g3', name: 'Family' },
];

const seedContacts: Contact[] = [
  { id: 'ct1', name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101', group: 'Friends' },
  { id: 'ct2', name: 'Bob Jones', email: 'bob@example.com', phone: '555-0102', group: 'Work' },
  { id: 'ct3', name: 'Carol White', email: 'carol@example.com', phone: '555-0103', group: 'Family' },
  { id: 'ct4', name: 'Dan Brown', email: 'dan@example.com', phone: '555-0104', group: 'Friends' },
];

let groups: Group[] = seedGroups.map(g => ({ ...g }));
let contacts: Contact[] = seedContacts.map(c => ({ ...c }));
let nextGroupId = 4;
let nextContactId = 5;

export function __reset() {
  groups = seedGroups.map(g => ({ ...g }));
  contacts = seedContacts.map(c => ({ ...c }));
  nextGroupId = 4;
  nextContactId = 5;
}

export function getGroups(): Group[] { return groups.slice(); }
export function getContacts(): Contact[] { return contacts.slice(); }

export function addContact(data: Omit<Contact, 'id'>): Contact | { error: string } {
  if (!data.name.trim()) return { error: 'Name required' };
  if (!data.email.includes('@')) return { error: 'Invalid email' };
  const c: Contact = { id: `ct${nextContactId++}`, ...data };
  contacts.push(c);
  return c;
}

export function deleteContact(id: string): boolean {
  const idx = contacts.findIndex(c => c.id === id);
  if (idx === -1) return false;
  contacts.splice(idx, 1);
  return true;
}

export function addGroup(data: Omit<Group, 'id'>): Group | null {
  if (groups.some(g => g.name.toLowerCase() === data.name.toLowerCase())) return null;
  const g: Group = { id: `g${nextGroupId++}`, ...data };
  groups.push(g);
  return g;
}

export function searchContacts(query: string): Contact[] {
  const q = query.toLowerCase();
  if (!q) return contacts.slice();
  return contacts.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
}
