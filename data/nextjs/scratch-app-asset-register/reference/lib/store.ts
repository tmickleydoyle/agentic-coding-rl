import { Asset, Valuation } from "./types";

export interface StoreState {
  assets: Asset[];
  valuations: Valuation[];
}

let state: StoreState = {
  assets: [
    { id: "a1", name: "Main Residence", category: "Property", acquired: "2010-06-15" },
    { id: "a2", name: "Tesla Model S", category: "Vehicle", acquired: "2022-03-01" },
    { id: "a3", name: "ISA Account", category: "Financial", acquired: "2015-09-01" },
  ],
  valuations: [
    { id: "v1", assetName: "Main Residence", value: 480000, date: "2024-01-01" },
    { id: "v2", assetName: "Main Residence", value: 500000, date: "2024-06-01" },
    { id: "v3", assetName: "Tesla Model S", value: 35000, date: "2024-06-01" },
    { id: "v4", assetName: "ISA Account", value: 45000, date: "2024-06-01" },
  ],
};

export function getState(): StoreState {
  return state;
}

export function addAsset(a: Omit<Asset, "id">): Asset {
  const newA: Asset = { id: `a-${Date.now()}`, ...a };
  state = { ...state, assets: [...state.assets, newA] };
  return newA;
}

export function deleteAsset(id: string): void {
  state = { ...state, assets: state.assets.filter((a) => a.id !== id) };
}

export function addValuation(v: Omit<Valuation, "id">): Valuation {
  const newV: Valuation = { id: `v-${Date.now()}`, ...v };
  state = { ...state, valuations: [...state.valuations, newV] };
  return newV;
}

export function deleteValuation(id: string): void {
  state = { ...state, valuations: state.valuations.filter((v) => v.id !== id) };
}

function getLatestValuation(assetName: string): Valuation | null {
  const relevant = state.valuations.filter((v) => v.assetName === assetName);
  if (relevant.length === 0) return null;
  return relevant.reduce((best, v) => (v.date > best.date ? v : best));
}

export function getSummary(): { assetCount: number; valuationCount: number; totalValue: number } {
  let totalValue = 0;
  state.assets.forEach((a) => {
    const latest = getLatestValuation(a.name);
    if (latest) totalValue += latest.value;
  });
  return { assetCount: state.assets.length, valuationCount: state.valuations.length, totalValue };
}

export function __reset(): void {
  state = {
    assets: [
      { id: "a1", name: "Main Residence", category: "Property", acquired: "2010-06-15" },
      { id: "a2", name: "Tesla Model S", category: "Vehicle", acquired: "2022-03-01" },
      { id: "a3", name: "ISA Account", category: "Financial", acquired: "2015-09-01" },
    ],
    valuations: [
      { id: "v1", assetName: "Main Residence", value: 480000, date: "2024-01-01" },
      { id: "v2", assetName: "Main Residence", value: 500000, date: "2024-06-01" },
      { id: "v3", assetName: "Tesla Model S", value: 35000, date: "2024-06-01" },
      { id: "v4", assetName: "ISA Account", value: 45000, date: "2024-06-01" },
    ],
  };
}
