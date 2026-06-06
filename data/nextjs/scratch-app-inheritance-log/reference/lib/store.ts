import { InheritanceEntry, Heir } from "./types";

export interface StoreState {
  entries: InheritanceEntry[];
  heirs: Heir[];
}

let state: StoreState = {
  entries: [
    { id: "e1", heir: "Alice", amount: 50000, date: "2024-01-15", status: "Transferred" },
    { id: "e2", heir: "Bob", amount: 30000, date: "2024-03-20", status: "Pending" },
    { id: "e3", heir: "Carol", amount: 20000, date: "2024-02-10", status: "Disputed" },
  ],
  heirs: [
    { id: "h1", name: "Alice", share: 50 },
    { id: "h2", name: "Bob", share: 30 },
    { id: "h3", name: "Carol", share: 20 },
  ],
};

export function getState(): StoreState {
  return state;
}

export function addEntry(entry: Omit<InheritanceEntry, "id">): InheritanceEntry {
  const e: InheritanceEntry = { id: `e-${Date.now()}`, ...entry };
  state = { ...state, entries: [...state.entries, e] };
  return e;
}

export function deleteEntry(id: string): void {
  state = { ...state, entries: state.entries.filter((e) => e.id !== id) };
}

export function addHeir(heir: Omit<Heir, "id">): Heir {
  const h: Heir = { id: `h-${Date.now()}`, ...heir };
  state = { ...state, heirs: [...state.heirs, h] };
  return h;
}

export function deleteHeir(id: string): void {
  state = { ...state, heirs: state.heirs.filter((h) => h.id !== id) };
}

export function getSummary(): { entryCount: number; totalAmount: number; heirCount: number } {
  const totalAmount = state.entries.reduce((s, e) => s + e.amount, 0);
  return { entryCount: state.entries.length, totalAmount, heirCount: state.heirs.length };
}

export function __reset(): void {
  state = {
    entries: [
      { id: "e1", heir: "Alice", amount: 50000, date: "2024-01-15", status: "Transferred" },
      { id: "e2", heir: "Bob", amount: 30000, date: "2024-03-20", status: "Pending" },
      { id: "e3", heir: "Carol", amount: 20000, date: "2024-02-10", status: "Disputed" },
    ],
    heirs: [
      { id: "h1", name: "Alice", share: 50 },
      { id: "h2", name: "Bob", share: 30 },
      { id: "h3", name: "Carol", share: 20 },
    ],
  };
}
