import { Clause, Witness } from "./types";

export interface StoreState {
  clauses: Clause[];
  witnesses: Witness[];
}

let state: StoreState = {
  clauses: [
    { id: "c1", title: "Executor Appointment", body: "I appoint Alice as executor of my estate." },
    { id: "c2", title: "Asset Distribution", body: "All assets shall be distributed equally among my children." },
  ],
  witnesses: [
    { id: "w1", name: "John Smith", status: "Signed" },
    { id: "w2", name: "Mary Jones", status: "Pending" },
  ],
};

export function getState(): StoreState {
  return state;
}

export function addClause(clause: Omit<Clause, "id">): Clause {
  const newC: Clause = { id: `c-${Date.now()}`, ...clause };
  state = { ...state, clauses: [...state.clauses, newC] };
  return newC;
}

export function deleteClause(id: string): void {
  state = { ...state, clauses: state.clauses.filter((c) => c.id !== id) };
}

export function addWitness(name: string): Witness {
  const w: Witness = { id: `w-${Date.now()}`, name, status: "Pending" };
  state = { ...state, witnesses: [...state.witnesses, w] };
  return w;
}

export function toggleWitness(id: string): void {
  state = {
    ...state,
    witnesses: state.witnesses.map((w) =>
      w.id === id ? { ...w, status: w.status === "Signed" ? "Pending" : "Signed" } : w
    ),
  };
}

export function getSummary(): { clauseCount: number; signedCount: number; pendingCount: number; complete: boolean } {
  const signed = state.witnesses.filter((w) => w.status === "Signed").length;
  const pending = state.witnesses.filter((w) => w.status === "Pending").length;
  return {
    clauseCount: state.clauses.length,
    signedCount: signed,
    pendingCount: pending,
    complete: state.clauses.length >= 2 && signed >= 2,
  };
}

export function __reset(): void {
  state = {
    clauses: [
      { id: "c1", title: "Executor Appointment", body: "I appoint Alice as executor of my estate." },
      { id: "c2", title: "Asset Distribution", body: "All assets shall be distributed equally among my children." },
    ],
    witnesses: [
      { id: "w1", name: "John Smith", status: "Signed" },
      { id: "w2", name: "Mary Jones", status: "Pending" },
    ],
  };
}
