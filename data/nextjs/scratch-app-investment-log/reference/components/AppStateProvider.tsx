import React, { createContext, useContext, useState } from "react";
import { AppState, Route, Holding, Transaction } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addHolding: (h: Holding) => void;
  deleteHolding: (id: string) => void;
  addTransaction: (t: Transaction) => void;
}

export const AppContext = createContext<AppContextValue>({
  route: "portfolio", holdings: [], transactions: [],
  setRoute: () => {}, addHolding: () => {}, deleteHolding: () => {}, addTransaction: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("portfolio");
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: "h1", ticker: "AAPL", shares: 10, avgPrice: 150, currentPrice: 180 },
    { id: "h2", ticker: "MSFT", shares: 5, avgPrice: 280, currentPrice: 310 },
    { id: "h3", ticker: "GOOGL", shares: 2, avgPrice: 2800, currentPrice: 2650 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t1", ticker: "AAPL", type: "buy", shares: 10, price: 150, date: "2023-06-01" },
    { id: "t2", ticker: "MSFT", type: "buy", shares: 5, price: 280, date: "2023-07-15" },
    { id: "t3", ticker: "GOOGL", type: "buy", shares: 2, price: 2800, date: "2023-08-01" },
  ]);

  function addHolding(h: Holding) { setHoldings((prev) => [...prev, h]); }
  function deleteHolding(id: string) { setHoldings((prev) => prev.filter((h) => h.id !== id)); }
  function addTransaction(t: Transaction) { setTransactions((prev) => [...prev, t]); }

  return (
    <AppContext.Provider value={{ route, holdings, transactions, setRoute, addHolding, deleteHolding, addTransaction }}>
      {children}
    </AppContext.Provider>
  );
}
