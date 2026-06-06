'use client'
import React, { createContext, useContext, useState } from 'react';
import { Stock, Alert, HistoryEntry, Route } from '../lib/types';

interface AppState {
  route: Route;
  stocks: Stock[];
  alerts: Alert[];
  history: HistoryEntry[];
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
  const [route, setRoute] = useState<Route>('home');
  const [stocks, setStocks] = useState<Stock[]>([
    { id: 'stk1', ticker: 'AAPL', name: 'Apple Inc.', price: 185.50, quantity: 10, currency: 'USD' },
    { id: 'stk2', ticker: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, quantity: 5, currency: 'USD' },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'al1', stockId: 'stk1', targetPrice: 200, condition: 'above', triggered: false },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [nextSid, setNextSid] = useState(3);
  const [nextAid, setNextAid] = useState(2);
  const [nextHid, setNextHid] = useState(1);

  const navigate = (r: Route) => setRoute(r);

  const addStock = (ticker: string, name: string, price: number, quantity: number, currency: string): boolean => {
    const t = ticker.toUpperCase().trim();
    if (!t || price <= 0 || quantity <= 0) return false;
    if (stocks.find(s => s.ticker === t)) return false;
    setStocks(prev => [...prev, { id: `stk${nextSid}`, ticker: t, name, price, quantity, currency }]);
    setNextSid(n => n + 1);
    return true;
  };

  const updateStockPrice = (id: string, price: number) => {
    setStocks(prev => prev.map(s => s.id === id ? { ...s, price } : s));
    setHistory(prev => [...prev, { id: `h${nextHid}`, stockId: id, price, timestamp: new Date().toISOString() }]);
    setNextHid(n => n + 1);
    setAlerts(prev => prev.map(a => {
      if (a.stockId !== id) return a;
      const triggered = a.condition === 'above' ? price >= a.targetPrice : price <= a.targetPrice;
      return triggered ? { ...a, triggered: true } : a;
    }));
  };

  const deleteStock = (id: string) => {
    setStocks(prev => prev.filter(s => s.id !== id));
    setAlerts(prev => prev.filter(a => a.stockId !== id));
    setHistory(prev => prev.filter(h => h.stockId !== id));
  };

  const addAlert = (stockId: string, targetPrice: number, condition: 'above' | 'below') => {
    setAlerts(prev => [...prev, { id: `al${nextAid}`, stockId, targetPrice, condition, triggered: false }]);
    setNextAid(n => n + 1);
  };

  const deleteAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <AppContext.Provider value={{ route, stocks, alerts, history, navigate, addStock, updateStockPrice, deleteStock, addAlert, deleteAlert }}>
      {children}
    </AppContext.Provider>
  );
}
