export type AssetCategory = "Property" | "Vehicle" | "Financial" | "Other";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  acquired: string;
}

export interface Valuation {
  id: string;
  assetName: string;
  value: number;
  date: string;
}
