import { Contact, Group } from "./types";

let groups: Group[] = [
  { id: "g1", name: "Family", color: "red" },
  { id: "g2", name: "Work", color: "blue" },
];

let contacts: Contact[] = [
  { id: "ct1", name: "Alice Smith", email: "alice@example.com", phone: "555-0001", address: "123 Main St", groupId: "g1", favorite: true },
  { id: "ct2", name: "Bob Jones", email: "bob@example.com", phone: "555-0002", address: "456 Oak Ave", groupId: "g2", favorite: false },
  { id: "ct3", name: "Carol Lee", email: "carol@example.com", phone: "555-0003", address: "789 Pine Rd", groupId: "g2", favorite: false },
];

let nextGroupId = 3;
let nextContactId = 4;

export function __reset() {
  groups = [
    { id: "g1", name: "Family", color: "red" },
    { id: "g2", name: "Work", color: "blue" },
  ];
  contacts = [
    { id: "ct1", name: "Alice Smith", email: "alice@example.com", phone: "555-0001", address: "123 Main St", groupId: "g1", favorite: true },
    { id: "ct2", name: "Bob Jones", email: "bob@example.com", phone: "555-0002", address: "456 Oak Ave", groupId: "g2", favorite: false },
    { id: "ct3", name: "Carol Lee", email: "carol@example.com", phone: "555-0003", address: "789 Pine Rd", groupId: "g2", favorite: false },
  ];
  nextGroupId = 3;
  nextContactId = 4;
}

export function getGroups(): Group[] { return groups; }
export function addGroup(data: Omit<Group, "id">): Group {
  const g: Group = { id: `g${nextGroupId++}`, ...data };
  groups.push(g);
  return g;
}
export function removeGroup(id: string): boolean {
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  groups.splice(idx, 1);
  return true;
}

export function getContacts(): Contact[] { return contacts; }
export function addContact(data: Omit<Contact, "id">): Contact {
  const c: Contact = { id: `ct${nextContactId++}`, ...data };
  contacts.push(c);
  return c;
}
export function removeContact(id: string): boolean {
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  contacts.splice(idx, 1);
  return true;
}
export function toggleFavorite(id: string): Contact | null {
  const c = contacts.find((c) => c.id === id);
  if (!c) return null;
  c.favorite = !c.favorite;
  return c;
}
export function getFavorites(): Contact[] {
  return contacts.filter((c) => c.favorite);
}
export function getContactsByGroup(groupId: string): Contact[] {
  return contacts.filter((c) => c.groupId === groupId);
}
