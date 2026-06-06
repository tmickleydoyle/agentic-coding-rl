import { Trust, Distribution } from "./types";

export interface StoreState {
  trusts: Trust[];
  distributions: Distribution[];
}

let state: StoreState = {
  trusts: [
    { id: "t1", name: "Family Trust", trustee: "Alice", principal: 500000 },
    { id: "t2", name: "Education Trust", trustee: "Bob", principal: 150000 },
  ],
  distributions: [
    { id: "d1", trustName: "Family Trust", beneficiary: "Carol", amount: 25000, date: "2024-03-01" },
    { id: "d2", trustName: "Education Trust", beneficiary: "Dave", amount: 10000, date: "2024-04-15" },
  ],
};

export function getState(): StoreState {
  return state;
}

export function addTrust(t: Omit<Trust, "id">): Trust {
  const newT: Trust = { id: `t-${Date.now()}`, ...t };
  state = { ...state, trusts: [...state.trusts, newT] };
  return newT;
}

export function deleteTrust(id: string): void {
  state = { ...state, trusts: state.trusts.filter((t) => t.id !== id) };
}

export function addDistribution(d: Omit<Distribution, "id">): Distribution {
  const newD: Distribution = { id: `d-${Date.now()}`, ...d };
  state = { ...state, distributions: [...state.distributions, newD] };
  return newD;
}

export function deleteDistribution(id: string): void {
  state = { ...state, distributions: state.distributions.filter((d) => d.id !== id) };
}

export function getSummary(): { trustCount: number; totalPrincipal: number; totalDistributed: number } {
  const totalPrincipal = state.trusts.reduce((s, t) => s + t.principal, 0);
  const totalDistributed = state.distributions.reduce((s, d) => s + d.amount, 0);
  return { trustCount: state.trusts.length, totalPrincipal, totalDistributed };
}

export function __reset(): void {
  state = {
    trusts: [
      { id: "t1", name: "Family Trust", trustee: "Alice", principal: 500000 },
      { id: "t2", name: "Education Trust", trustee: "Bob", principal: 150000 },
    ],
    distributions: [
      { id: "d1", trustName: "Family Trust", beneficiary: "Carol", amount: 25000, date: "2024-03-01" },
      { id: "d2", trustName: "Education Trust", beneficiary: "Dave", amount: 10000, date: "2024-04-15" },
    ],
  };
}
