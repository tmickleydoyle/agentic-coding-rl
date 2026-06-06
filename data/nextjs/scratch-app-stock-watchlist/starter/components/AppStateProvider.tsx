'use client'
import React, { createContext, useContext } from 'react';
import { Stock, Alert, HistoryEntry, Route } from '../lib/types';

interface AppState {
  route: Route; stocks: Stock[]; alerts: Alert[]; history: HistoryEntry[];
  navigate: (r: Route) => void;
  addStock: (ticker: string, name: string, price: number, quantity: number, currency: string) => boolean;
  updateStockPrice: (id: string, price: number) => void;
  deleteStock: (id: string) => void;
  addAlert: (stockId: string, targetPrice: number, condition: 'above' | 'below') => void;
  deleteAlert: (id: string) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', stocks: [], alerts: [], history: [],
  navigate: () => {}, addStock: () => false, updateStockPrice: () => {}, deleteStock: () => {},
  addAlert: () => {}, deleteAlert: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', stocks: [], alerts: [], history: [],
      navigate: () => {}, addStock: () => false, updateStockPrice: () => {}, deleteStock: () => {},
      addAlert: () => {}, deleteAlert: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
