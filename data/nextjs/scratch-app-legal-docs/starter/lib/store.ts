import type { LegalDocument, Category, Status } from "./types";

export function getDocuments(): LegalDocument[] {
  return [];
}

export function getDocument(_id: string): LegalDocument | undefined {
  return undefined;
}

export function addDocument(_data: { title: string; category: Category; status: Status }): LegalDocument {
  throw new Error("Not implemented");
}

export function __reset(): void {}
