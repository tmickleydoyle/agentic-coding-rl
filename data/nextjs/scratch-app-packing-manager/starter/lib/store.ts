import type { PackingList } from "./types";

export function getLists(): PackingList[] {
  return [];
}

export function addList(_data: { tripName: string; destination: string; departureDate: string }): PackingList {
  return { id: "", tripName: "", destination: "", departureDate: "", items: [] };
}

export function __reset(): void {}
