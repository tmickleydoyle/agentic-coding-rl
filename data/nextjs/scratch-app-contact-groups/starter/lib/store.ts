import { Contact, Group } from "./types";

export function __reset(): void {}
export function getGroups(): Group[] { return []; }
export function addGroup(_data: Omit<Group, "id">): Group { return {} as Group; }
export function removeGroup(_id: string): boolean { return false; }
export function getContacts(): Contact[] { return []; }
export function addContact(_data: Omit<Contact, "id">): Contact { return {} as Contact; }
export function removeContact(_id: string): boolean { return false; }
export function toggleFavorite(_id: string): Contact | null { return null; }
export function getFavorites(): Contact[] { return []; }
export function getContactsByGroup(_groupId: string): Contact[] { return []; }
