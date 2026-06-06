export type ShareholderType = "Founder" | "Employee" | "Investor" | "Advisor";

export interface Shareholder {
  id: string;
  name: string;
  type: ShareholderType;
  shares: number;
}

export interface Round {
  id: string;
  name: string;
  date: string;
  sharePrice: number;
  newShares: number;
}
