import type { Application, Contact, Note, AppStatus } from './types';

let apps: Application[] = [];
let contacts: Contact[] = [];
let notes: Note[] = [];

export function __reset() { apps = []; contacts = []; notes = []; }
export function getApplications() { return apps; }
export function addApplication(_data: Omit<Application, 'id'>): Application { return {} as Application; }
export function updateApplicationStatus(_id: string, _status: AppStatus) {}
export function deleteApplication(_id: string) {}
export function getContacts() { return contacts; }
export function addContact(_data: Omit<Contact, 'id'>): Contact { return {} as Contact; }
export function deleteContact(_id: string) {}
export function getNotes() { return notes; }
export function addNote(_data: Omit<Note, 'id'>): Note { return {} as Note; }
export function deleteNote(_id: string) {}
