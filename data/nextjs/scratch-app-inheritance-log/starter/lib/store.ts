import { InheritanceEntry, Heir } from "./types";

export interface StoreState {
  entries: InheritanceEntry[];
  heirs: Heir[];
}

export function getState(): StoreState {
  return { entries: [], heirs: [] };
}

export function addEntry(_entry: Omit<InheritanceEntry, "id">): InheritanceEntry {
  return { id: "", heir: "", amount: 0, date: "", status: "Pending" };
}

export function deleteEntry(_id: string): void {}

export function addHeir(_heir: Omit<Heir, "id">): Heir {
  return { id: "", name: "", share: 0 };
}

export function deleteHeir(_id: string): void {}

export function getSummary(): { entryCount: number; totalAmount: number; heirCount: number } {
  return { entryCount: 0, totalAmount: 0, heirCount: 0 };
}

export function __reset(): void {}
