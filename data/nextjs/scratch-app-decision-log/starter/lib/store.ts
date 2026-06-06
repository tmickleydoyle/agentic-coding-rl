import { Decision, DecisionStatus } from "./types";

export function getDecisions(): Decision[] { return []; }
export function addDecision(_data: Omit<Decision, "id" | "createdAt">): Decision {
  return { id: "", title: "", context: "", options: "", outcome: "", status: "pending", tags: [], decisionDate: "", createdAt: "" };
}
export function updateDecision(_id: string, _data: Partial<Omit<Decision, "id" | "createdAt">>): Decision | undefined { return undefined; }
export function deleteDecision(_id: string): boolean { return false; }
export function getByStatus(_status: DecisionStatus): Decision[] { return []; }
export function getStats(): Record<DecisionStatus, number> { return { pending: 0, decided: 0, revisited: 0 }; }
export function __reset(): void {}
