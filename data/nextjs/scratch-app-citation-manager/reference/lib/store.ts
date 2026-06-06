import { Citation, CitationType } from "./types";

let citations: Citation[] = [];
let nextId = 1;

export function getCitations(): Citation[] { return citations; }

export function getCitationById(id: string): Citation | undefined {
  return citations.find((c) => c.id === id);
}

export function addCitation(data: Omit<Citation, "id" | "createdAt">): Citation {
  const c: Citation = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  citations.push(c);
  return c;
}

export function updateCitation(id: string, data: Partial<Omit<Citation, "id" | "createdAt">>): Citation | undefined {
  const idx = citations.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  citations[idx] = { ...citations[idx], ...data };
  return citations[idx];
}

export function deleteCitation(id: string): boolean {
  const idx = citations.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  citations.splice(idx, 1);
  return true;
}

export function getCollections(): string[] {
  const s = new Set<string>();
  citations.forEach((c) => { if (c.collection) s.add(c.collection); });
  return Array.from(s).sort();
}

export function getCitationsByCollection(col: string): Citation[] {
  return citations.filter((c) => c.collection === col);
}

export function searchCitations(q: string): Citation[] {
  const query = q.toLowerCase();
  return citations.filter(
    (c) =>
      c.title.toLowerCase().includes(query) ||
      c.authors.toLowerCase().includes(query) ||
      c.notes.toLowerCase().includes(query)
  );
}

export function exportApa(ids?: string[]): string {
  const list = ids ? citations.filter((c) => ids.includes(c.id)) : citations;
  return list.map((c) => `${c.authors} (${c.year}). ${c.title}.`).join("\n");
}

export function __reset(): void {
  citations = [];
  nextId = 1;
}
