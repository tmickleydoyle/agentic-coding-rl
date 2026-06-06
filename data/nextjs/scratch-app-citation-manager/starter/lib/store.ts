import { Citation } from "./types";

export function getCitations(): Citation[] { return []; }
export function getCitationById(_id: string): Citation | undefined { return undefined; }
export function addCitation(_data: Omit<Citation, "id" | "createdAt">): Citation {
  return { id: "", title: "", authors: "", year: "", type: "other", url: "", collection: "", notes: "", createdAt: "" };
}
export function updateCitation(_id: string, _data: Partial<Omit<Citation, "id" | "createdAt">>): Citation | undefined { return undefined; }
export function deleteCitation(_id: string): boolean { return false; }
export function getCollections(): string[] { return []; }
export function getCitationsByCollection(_col: string): Citation[] { return []; }
export function searchCitations(_q: string): Citation[] { return []; }
export function exportApa(_ids?: string[]): string { return ""; }
export function __reset(): void {}
