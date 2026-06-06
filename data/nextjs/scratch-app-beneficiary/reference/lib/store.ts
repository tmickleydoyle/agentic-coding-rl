import { Profile, Allocation } from "./types";

export interface StoreState {
  profiles: Profile[];
  allocations: Allocation[];
}

let state: StoreState = {
  profiles: [
    { id: "p1", name: "Alice Chen", dob: "1985-04-12", email: "alice@example.com" },
    { id: "p2", name: "Bob Tran", dob: "1990-08-23", email: "bob@example.com" },
  ],
  allocations: [
    { id: "al1", beneficiary: "Alice Chen", asset: "Family Home", percentage: 60 },
    { id: "al2", beneficiary: "Alice Chen", asset: "Savings Account", percentage: 30 },
    { id: "al3", beneficiary: "Bob Tran", asset: "Stock Portfolio", percentage: 100 },
  ],
};

export function getState(): StoreState {
  return state;
}

export function addProfile(p: Omit<Profile, "id">): Profile {
  const newP: Profile = { id: `p-${Date.now()}`, ...p };
  state = { ...state, profiles: [...state.profiles, newP] };
  return newP;
}

export function deleteProfile(id: string): void {
  state = { ...state, profiles: state.profiles.filter((p) => p.id !== id) };
}

export function addAllocation(a: Omit<Allocation, "id">): Allocation {
  const newA: Allocation = { id: `al-${Date.now()}`, ...a };
  state = { ...state, allocations: [...state.allocations, newA] };
  return newA;
}

export function deleteAllocation(id: string): void {
  state = { ...state, allocations: state.allocations.filter((a) => a.id !== id) };
}

export function getReport(): Array<{ name: string; total: number }> {
  const map: Record<string, number> = {};
  state.allocations.forEach((a) => {
    map[a.beneficiary] = (map[a.beneficiary] || 0) + a.percentage;
  });
  return Object.keys(map).map((name) => ({ name, total: map[name] }));
}

export function __reset(): void {
  state = {
    profiles: [
      { id: "p1", name: "Alice Chen", dob: "1985-04-12", email: "alice@example.com" },
      { id: "p2", name: "Bob Tran", dob: "1990-08-23", email: "bob@example.com" },
    ],
    allocations: [
      { id: "al1", beneficiary: "Alice Chen", asset: "Family Home", percentage: 60 },
      { id: "al2", beneficiary: "Alice Chen", asset: "Savings Account", percentage: 30 },
      { id: "al3", beneficiary: "Bob Tran", asset: "Stock Portfolio", percentage: 100 },
    ],
  };
}
