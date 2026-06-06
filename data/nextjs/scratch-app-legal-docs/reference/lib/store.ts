import type { LegalDocument, Category, Status } from "./types";

const seed: LegalDocument[] = [
  { id: "1", title: "Employment Agreement", category: "Contract", status: "Active", createdAt: "2024-01-15" },
  { id: "2", title: "Privacy Policy", category: "Policy", status: "Active", createdAt: "2024-02-01" },
  { id: "3", title: "NDA Template", category: "NDA", status: "Draft", createdAt: "2024-03-10" },
];

let documents: LegalDocument[] = seed.map((d) => ({ ...d }));
let nextId = 4;

export function getDocuments(): LegalDocument[] {
  return documents;
}

export function getDocument(id: string): LegalDocument | undefined {
  return documents.find((d) => d.id === id);
}

export function addDocument(data: { title: string; category: Category; status: Status }): LegalDocument {
  const doc: LegalDocument = {
    id: String(nextId++),
    title: data.title,
    category: data.category,
    status: data.status,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  documents.push(doc);
  return doc;
}

export function __reset(): void {
  documents = seed.map((d) => ({ ...d }));
  nextId = 4;
}
