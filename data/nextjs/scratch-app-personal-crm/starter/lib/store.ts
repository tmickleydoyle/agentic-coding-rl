import { Contact, Note } from "./types";

export function __reset(): void {}

export function getContacts(): Contact[] {
  return [];
}

export function addContact(_data: { name: string; company: string; email: string; phone?: string; tags?: string[] }): Contact {
  return { id: "", name: "", company: "", email: "", phone: "", tags: [], notes: [], createdAt: "" };
}

export function deleteContact(_id: string): void {}

export function addNote(_contactId: string, _content: string): Note {
  return { id: "", contactId: "", content: "", createdAt: "" };
}

export function getAllNotes(): Array<Note & { contactName: string }> {
  return [];
}

export function getAllTags(): Array<{ tag: string; count: number }> {
  return [];
}
