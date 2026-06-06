import { Clause, Witness } from "./types";

export interface StoreState {
  clauses: Clause[];
  witnesses: Witness[];
}

export function getState(): StoreState {
  return { clauses: [], witnesses: [] };
}

export function addClause(_clause: Omit<Clause, "id">): Clause {
  return { id: "", title: "", body: "" };
}

export function deleteClause(_id: string): void {}

export function addWitness(_name: string): Witness {
  return { id: "", name: "", status: "Pending" };
}

export function toggleWitness(_id: string): void {}

export function getSummary(): { clauseCount: number; signedCount: number; pendingCount: number; complete: boolean } {
  return { clauseCount: 0, signedCount: 0, pendingCount: 0, complete: false };
}

export function __reset(): void {}
