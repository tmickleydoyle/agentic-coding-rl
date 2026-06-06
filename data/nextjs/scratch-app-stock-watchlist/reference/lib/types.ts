export interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface Alert {
  id: string;
  stockId: string;
  targetPrice: number;
  condition: 'above' | 'below';
  triggered: boolean;
}

export interface HistoryEntry {
  id: string;
  stockId: string;
  price: number;
  timestamp: string;
}

export type Route = 'home' | 'watchlist' | 'alerts' | 'history';
