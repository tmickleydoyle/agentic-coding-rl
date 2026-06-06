import { Asset, Beneficiary } from "./types";

export interface StoreState {
  assets: Asset[];
  beneficiaries: Beneficiary[];
  notes: string;
}

export function getState(): StoreState {
  return { assets: [], beneficiaries: [], notes: "" };
}

export function addAsset(_asset: Omit<Asset, "id">): Asset {
  return { id: "", name: "", type: "Cash", value: 0, beneficiary: "" };
}

export function deleteAsset(_id: string): void {}

export function addBeneficiary(_b: Omit<Beneficiary, "id">): Beneficiary {
  return { id: "", name: "", relationship: "Other" };
}

export function deleteBeneficiary(_id: string): void {}

export function saveNotes(_notes: string): void {}

export function getSummary(): { totalValue: number; assetCount: number; beneficiaryCount: number } {
  return { totalValue: 0, assetCount: 0, beneficiaryCount: 0 };
}

export function __reset(): void {}
