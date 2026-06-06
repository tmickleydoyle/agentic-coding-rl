import { Document, Folder } from "./types";

let folders: Folder[] = [
  { id: "f1", name: "Work", color: "blue" },
  { id: "f2", name: "Personal", color: "green" },
];

let documents: Document[] = [
  { id: "d1", title: "Q2 Report", description: "Quarterly report", url: "https://example.com/q2.pdf", folderId: "f1", tags: ["finance", "report"], shared: false, createdAt: "2024-06-01" },
  { id: "d2", title: "Lease Agreement", description: "Home lease", url: "https://example.com/lease.pdf", folderId: "f2", tags: ["legal", "home"], shared: true, createdAt: "2024-05-15" },
];

let nextFolderId = 3;
let nextDocId = 3;

export function __reset() {
  folders = [
    { id: "f1", name: "Work", color: "blue" },
    { id: "f2", name: "Personal", color: "green" },
  ];
  documents = [
    { id: "d1", title: "Q2 Report", description: "Quarterly report", url: "https://example.com/q2.pdf", folderId: "f1", tags: ["finance", "report"], shared: false, createdAt: "2024-06-01" },
    { id: "d2", title: "Lease Agreement", description: "Home lease", url: "https://example.com/lease.pdf", folderId: "f2", tags: ["legal", "home"], shared: true, createdAt: "2024-05-15" },
  ];
  nextFolderId = 3;
  nextDocId = 3;
}

export function getFolders(): Folder[] { return folders; }
export function addFolder(data: Omit<Folder, "id">): Folder {
  const f: Folder = { id: `f${nextFolderId++}`, ...data };
  folders.push(f);
  return f;
}
export function removeFolder(id: string): boolean {
  const idx = folders.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  folders.splice(idx, 1);
  return true;
}

export function getDocuments(): Document[] { return documents; }
export function addDocument(data: Omit<Document, "id">): Document {
  const d: Document = { id: `d${nextDocId++}`, ...data };
  documents.push(d);
  return d;
}
export function removeDocument(id: string): boolean {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  documents.splice(idx, 1);
  return true;
}
export function toggleShared(id: string): Document | null {
  const d = documents.find((d) => d.id === id);
  if (!d) return null;
  d.shared = !d.shared;
  return d;
}
export function searchDocuments(query: string): Document[] {
  const q = query.toLowerCase();
  return documents.filter((d) => d.title.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q)));
}
