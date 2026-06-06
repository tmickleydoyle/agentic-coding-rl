import { Asset, Beneficiary } from "./types";

export interface StoreState {
  assets: Asset[];
  beneficiaries: Beneficiary[];
  notes: string;
}

let state: StoreState = {
  assets: [
    { id: "a1", name: "Family Home", type: "Real Estate", value: 450000, beneficiary: "Alice" },
    { id: "a2", name: "Stock Portfolio", type: "Investment", value: 120000, beneficiary: "Bob" },
    { id: "a3", name: "Savings Account", type: "Cash", value: 30000, beneficiary: "Alice" },
  ],
  beneficiaries: [
    { id: "b1", name: "Alice", relationship: "Spouse" },
    { id: "b2", name: "Bob", relationship: "Child" },
  ],
  notes: "Review asset allocation annually.",
};

export function getState(): StoreState {
  return state;
}

export function addAsset(asset: Omit<Asset, "id">): Asset {
  const newAsset: Asset = { id: `a-${Date.now()}`, ...asset };
  state = { ...state, assets: [...state.assets, newAsset] };
  return newAsset;
}

export function deleteAsset(id: string): void {
  state = { ...state, assets: state.assets.filter((a) => a.id !== id) };
}

export function addBeneficiary(b: Omit<Beneficiary, "id">): Beneficiary {
  const newB: Beneficiary = { id: `b-${Date.now()}`, ...b };
  state = { ...state, beneficiaries: [...state.beneficiaries, newB] };
  return newB;
}

export function deleteBeneficiary(id: string): void {
  state = { ...state, beneficiaries: state.beneficiaries.filter((b) => b.id !== id) };
}

export function saveNotes(notes: string): void {
  state = { ...state, notes };
}

export function getSummary(): { totalValue: number; assetCount: number; beneficiaryCount: number } {
  const totalValue = state.assets.reduce((sum, a) => sum + a.value, 0);
  return { totalValue, assetCount: state.assets.length, beneficiaryCount: state.beneficiaries.length };
}

export function __reset(): void {
  state = {
    assets: [
      { id: "a1", name: "Family Home", type: "Real Estate", value: 450000, beneficiary: "Alice" },
      { id: "a2", name: "Stock Portfolio", type: "Investment", value: 120000, beneficiary: "Bob" },
      { id: "a3", name: "Savings Account", type: "Cash", value: 30000, beneficiary: "Alice" },
    ],
    beneficiaries: [
      { id: "b1", name: "Alice", relationship: "Spouse" },
      { id: "b2", name: "Bob", relationship: "Child" },
    ],
    notes: "Review asset allocation annually.",
  };
}
