import type { Application, Contact, Note, AppStatus } from './types';

let apps: Application[] = [
  { id: 'a1', company: 'Acme Inc', role: 'Engineer', status: 'applied', appliedDate: '2025-10-01', url: '' },
  { id: 'a2', company: 'Globex', role: 'Designer', status: 'interview', appliedDate: '2025-10-15', url: 'https://globex.com' },
];
let contacts: Contact[] = [
  { id: 'ct1', applicationId: 'a1', name: 'John Doe', email: 'john@acme.com', role: 'Recruiter' },
];
let notes: Note[] = [
  { id: 'n1', applicationId: 'a1', text: 'Applied via LinkedIn', createdAt: '2025-10-01' },
];
let nextId = 100;

export function __reset() {
  apps = [
    { id: 'a1', company: 'Acme Inc', role: 'Engineer', status: 'applied', appliedDate: '2025-10-01', url: '' },
    { id: 'a2', company: 'Globex', role: 'Designer', status: 'interview', appliedDate: '2025-10-15', url: 'https://globex.com' },
  ];
  contacts = [{ id: 'ct1', applicationId: 'a1', name: 'John Doe', email: 'john@acme.com', role: 'Recruiter' }];
  notes = [{ id: 'n1', applicationId: 'a1', text: 'Applied via LinkedIn', createdAt: '2025-10-01' }];
  nextId = 100;
}

export function getApplications() { return apps; }
export function addApplication(data: Omit<Application, 'id'>): Application {
  const a: Application = { id: `a${nextId++}`, ...data };
  apps = [...apps, a];
  return a;
}
export function updateApplicationStatus(id: string, status: AppStatus) {
  apps = apps.map(a => a.id === id ? { ...a, status } : a);
}
export function deleteApplication(id: string) {
  contacts = contacts.filter(c => c.applicationId !== id);
  notes = notes.filter(n => n.applicationId !== id);
  apps = apps.filter(a => a.id !== id);
}

export function getContacts() { return contacts; }
export function addContact(data: Omit<Contact, 'id'>): Contact {
  const c: Contact = { id: `ct${nextId++}`, ...data };
  contacts = [...contacts, c];
  return c;
}
export function deleteContact(id: string) { contacts = contacts.filter(c => c.id !== id); }

export function getNotes() { return notes; }
export function addNote(data: Omit<Note, 'id'>): Note {
  const n: Note = { id: `n${nextId++}`, ...data };
  notes = [...notes, n];
  return n;
}
export function deleteNote(id: string) { notes = notes.filter(n => n.id !== id); }
