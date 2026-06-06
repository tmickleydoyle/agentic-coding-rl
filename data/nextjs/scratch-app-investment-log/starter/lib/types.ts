export interface Holding {
  id: string;
  ticker: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  ticker: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  date: string;
}

export type Route = "portfolio" | "holdings" | "transactions" | "performance";

export interface AppState {
  route: Route;
  holdings: Holding[];
  transactions: Transaction[];
}
