import { ResearchNote } from "./types";

export function getNotes(): ResearchNote[] { return []; }
export function getNoteById(_id: string): ResearchNote | undefined { return undefined; }
export function addNote(_data: Omit<ResearchNote, "id" | "createdAt" | "updatedAt">): ResearchNote {
  return { id: "", title: "", content: "", tags: [], sourceUrl: "", createdAt: "", updatedAt: "" };
}
export function updateNote(_id: string, _data: Partial<Omit<ResearchNote, "id" | "createdAt">>): ResearchNote | undefined { return undefined; }
export function deleteNote(_id: string): boolean { return false; }
export function getAllTags(): string[] { return []; }
export function searchNotes(_query: string): ResearchNote[] { return []; }
export function __reset(): void {}
