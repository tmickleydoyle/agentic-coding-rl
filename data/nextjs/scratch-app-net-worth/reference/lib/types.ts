export type AssetCategory = "cash" | "investment" | "real_estate" | "retirement" | "other";
export type LiabilityCategory = "mortgage" | "loan" | "credit_card" | "other";

export interface Asset {
  id: string;
  name: string;
  value: number;
  category: AssetCategory;
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  category: LiabilityCategory;
}

export interface Snapshot {
  id: string;
  date: string;
  netWorth: number;
}

export type Route = "summary" | "assets" | "liabilities" | "history";

export interface AppState {
  route: Route;
  assets: Asset[];
  liabilities: Liability[];
  snapshots: Snapshot[];
}
