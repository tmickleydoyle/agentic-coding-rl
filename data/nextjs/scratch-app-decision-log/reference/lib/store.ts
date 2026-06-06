import { Decision, DecisionStatus } from "./types";

let decisions: Decision[] = [];
let nextId = 1;

export function getDecisions(): Decision[] { return decisions; }

export function addDecision(data: Omit<Decision, "id" | "createdAt">): Decision {
  const d: Decision = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  decisions.push(d);
  return d;
}

export function updateDecision(id: string, data: Partial<Omit<Decision, "id" | "createdAt">>): Decision | undefined {
  const idx = decisions.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  decisions[idx] = { ...decisions[idx], ...data };
  return decisions[idx];
}

export function deleteDecision(id: string): boolean {
  const idx = decisions.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  decisions.splice(idx, 1);
  return true;
}

export function getByStatus(status: DecisionStatus): Decision[] {
  return decisions.filter((d) => d.status === status);
}

export function getStats(): Record<DecisionStatus, number> {
  const counts: Record<DecisionStatus, number> = { pending: 0, decided: 0, revisited: 0 };
  decisions.forEach((d) => { counts[d.status]++; });
  return counts;
}

export function __reset(): void {
  decisions = [];
  nextId = 1;
}
