import { Trust, Distribution } from "./types";

export interface StoreState {
  trusts: Trust[];
  distributions: Distribution[];
}

export function getState(): StoreState {
  return { trusts: [], distributions: [] };
}

export function addTrust(_t: Omit<Trust, "id">): Trust {
  return { id: "", name: "", trustee: "", principal: 0 };
}

export function deleteTrust(_id: string): void {}

export function addDistribution(_d: Omit<Distribution, "id">): Distribution {
  return { id: "", trustName: "", beneficiary: "", amount: 0, date: "" };
}

export function deleteDistribution(_id: string): void {}

export function getSummary(): { trustCount: number; totalPrincipal: number; totalDistributed: number } {
  return { trustCount: 0, totalPrincipal: 0, totalDistributed: 0 };
}

export function __reset(): void {}
