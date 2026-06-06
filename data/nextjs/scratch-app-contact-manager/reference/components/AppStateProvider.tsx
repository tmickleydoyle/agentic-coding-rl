'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Contact, Group, Route } from '../lib/types';

interface AppState {
  route: Route;
  contacts: Contact[];
  groups: Group[];
  navigate: (r: Route) => void;
  addContact: (data: Omit<Contact, 'id'>) => string | null;
  deleteContact: (id: string) => void;
  addGroup: (data: Omit<Group, 'id'>) => Group | null;
}

const AppContext = createContext<AppState>({
  route: 'home', contacts: [], groups: [],
  navigate: () => {}, addContact: () => null, deleteContact: () => {}, addGroup: () => null,
});

export function useApp() { return useContext(AppContext); }

const seedGroups: Group[] = [
  { id: 'g1', name: 'Friends' }, { id: 'g2', name: 'Work' }, { id: 'g3', name: 'Family' },
];
const seedContacts: Contact[] = [
  { id: 'ct1', name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101', group: 'Friends' },
  { id: 'ct2', name: 'Bob Jones', email: 'bob@example.com', phone: '555-0102', group: 'Work' },
  { id: 'ct3', name: 'Carol White', email: 'carol@example.com', phone: '555-0103', group: 'Family' },
  { id: 'ct4', name: 'Dan Brown', email: 'dan@example.com', phone: '555-0104', group: 'Friends' },
];

let cid = 5;
let gid = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [contacts, setContacts] = useState<Contact[]>(seedContacts.map(c => ({ ...c })));
  const [groups, setGroups] = useState<Group[]>(seedGroups.map(g => ({ ...g })));

  function navigate(r: Route) { setRoute(r); }

  function addContact(data: Omit<Contact, 'id'>): string | null {
    if (!data.name.trim()) return 'Name required';
    if (!data.email.includes('@')) return 'Invalid email';
    const c: Contact = { id: `ct${cid++}`, ...data };
    setContacts(prev => [...prev, c]);
    return null;
  }

  function deleteContact(id: string) { setContacts(prev => prev.filter(c => c.id !== id)); }

  function addGroup(data: Omit<Group, 'id'>): Group | null {
    if (groups.some(g => g.name.toLowerCase() === data.name.toLowerCase())) return null;
    const g: Group = { id: `g${gid++}`, ...data };
    setGroups(prev => [...prev, g]);
    return g;
  }

  return (
    <AppContext.Provider value={{ route, contacts, groups, navigate, addContact, deleteContact, addGroup }}>
      {children}
    </AppContext.Provider>
  );
}
