import { Document, Folder } from "./types";

export function __reset(): void {}
export function getFolders(): Folder[] { return []; }
export function addFolder(_data: Omit<Folder, "id">): Folder { return {} as Folder; }
export function removeFolder(_id: string): boolean { return false; }
export function getDocuments(): Document[] { return []; }
export function addDocument(_data: Omit<Document, "id">): Document { return {} as Document; }
export function removeDocument(_id: string): boolean { return false; }
export function toggleShared(_id: string): Document | null { return null; }
export function searchDocuments(_query: string): Document[] { return []; }
