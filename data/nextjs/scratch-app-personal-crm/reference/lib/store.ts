import { Contact, Note } from "./types";

const seedContacts: Contact[] = [
  {
    id: "c1",
    name: "Alice Johnson",
    company: "Acme Corp",
    email: "alice@acme.com",
    phone: "555-1001",
    tags: ["investor", "mentor"],
    notes: [{ id: "n1", contactId: "c1", content: "Met at React Conf", createdAt: "2024-01-15" }],
    createdAt: "2024-01-15",
  },
  {
    id: "c2",
    name: "Bob Smith",
    company: "Beta Inc",
    email: "bob@beta.com",
    phone: "555-1002",
    tags: ["client"],
    notes: [],
    createdAt: "2024-02-01",
  },
  {
    id: "c3",
    name: "Carol White",
    company: "Gamma Ltd",
    email: "carol@gamma.com",
    phone: "555-1003",
    tags: ["mentor"],
    notes: [{ id: "n2", contactId: "c3", content: "Intro via LinkedIn", createdAt: "2024-02-10" }],
    createdAt: "2024-02-10",
  },
];

let contacts: Contact[] = seedContacts.map((c) => ({ ...c, notes: [...c.notes] }));
let noteCounter = 3;
let contactCounter = 4;

export function __reset() {
  contacts = seedContacts.map((c) => ({ ...c, notes: [...c.notes] }));
  noteCounter = 3;
  contactCounter = 4;
}

export function getContacts(): Contact[] {
  return contacts;
}

export function addContact(data: { name: string; company: string; email: string; phone?: string; tags?: string[] }): Contact {
  const c: Contact = {
    id: `c${contactCounter++}`,
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone ?? "",
    tags: data.tags ?? [],
    notes: [],
    createdAt: new Date().toISOString(),
  };
  contacts.push(c);
  return c;
}

export function deleteContact(id: string): void {
  contacts = contacts.filter((c) => c.id !== id);
}

export function addNote(contactId: string, content: string): Note {
  const note: Note = {
    id: `n${noteCounter++}`,
    contactId,
    content,
    createdAt: new Date().toISOString(),
  };
  const c = contacts.find((c) => c.id === contactId);
  if (c) c.notes.push(note);
  return note;
}

export function getAllNotes(): Array<Note & { contactName: string }> {
  const result: Array<Note & { contactName: string }> = [];
  contacts.forEach((c) => {
    c.notes.forEach((n) => {
      result.push({ ...n, contactName: c.name });
    });
  });
  return result;
}

export function getAllTags(): Array<{ tag: string; count: number }> {
  const map = new Map<string, number>();
  contacts.forEach((c) => {
    c.tags.forEach((t) => {
      map.set(t, (map.get(t) ?? 0) + 1);
    });
  });
  const result: Array<{ tag: string; count: number }> = [];
  map.forEach((count, tag) => result.push({ tag, count }));
  return result;
}
