import { Profile, Allocation } from "./types";

export interface StoreState {
  profiles: Profile[];
  allocations: Allocation[];
}

export function getState(): StoreState {
  return { profiles: [], allocations: [] };
}

export function addProfile(_p: Omit<Profile, "id">): Profile {
  return { id: "", name: "", dob: "", email: "" };
}

export function deleteProfile(_id: string): void {}

export function addAllocation(_a: Omit<Allocation, "id">): Allocation {
  return { id: "", beneficiary: "", asset: "", percentage: 0 };
}

export function deleteAllocation(_id: string): void {}

export function getReport(): Array<{ name: string; total: number }> {
  return [];
}

export function __reset(): void {}
