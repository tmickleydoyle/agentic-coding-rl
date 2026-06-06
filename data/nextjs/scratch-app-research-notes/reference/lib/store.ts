import { ResearchNote } from "./types";

let notes: ResearchNote[] = [];
let nextId = 1;

export function getNotes(): ResearchNote[] {
  return notes;
}

export function getNoteById(id: string): ResearchNote | undefined {
  return notes.find((n) => n.id === id);
}

export function addNote(data: Omit<ResearchNote, "id" | "createdAt" | "updatedAt">): ResearchNote {
  const now = new Date().toISOString();
  const note: ResearchNote = { ...data, id: String(nextId++), createdAt: now, updatedAt: now };
  notes.push(note);
  return note;
}

export function updateNote(id: string, data: Partial<Omit<ResearchNote, "id" | "createdAt">>): ResearchNote | undefined {
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return undefined;
  notes[idx] = { ...notes[idx], ...data, updatedAt: new Date().toISOString() };
  return notes[idx];
}

export function deleteNote(id: string): boolean {
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  notes.splice(idx, 1);
  return true;
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function searchNotes(query: string): ResearchNote[] {
  const q = query.toLowerCase();
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function __reset(): void {
  notes = [];
  nextId = 1;
}
