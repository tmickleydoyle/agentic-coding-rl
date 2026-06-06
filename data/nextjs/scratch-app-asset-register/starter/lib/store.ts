import { Asset, Valuation } from "./types";

export interface StoreState {
  assets: Asset[];
  valuations: Valuation[];
}

export function getState(): StoreState {
  return { assets: [], valuations: [] };
}

export function addAsset(_a: Omit<Asset, "id">): Asset {
  return { id: "", name: "", category: "Other", acquired: "" };
}

export function deleteAsset(_id: string): void {}

export function addValuation(_v: Omit<Valuation, "id">): Valuation {
  return { id: "", assetName: "", value: 0, date: "" };
}

export function deleteValuation(_id: string): void {}

export function getSummary(): { assetCount: number; valuationCount: number; totalValue: number } {
  return { assetCount: 0, valuationCount: 0, totalValue: 0 };
}

export function __reset(): void {}
