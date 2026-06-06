import React, { createContext, useContext, useState, useCallback } from "react";
import type { Exchange } from "../lib/types";

interface AppState {
  route: string;
  exchanges: Exchange[];
  navigate: (r: string) => void;
  addExchange: (e: Exchange) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  exchanges: [],
  navigate: () => {},
  addExchange: () => {},
});

const SEED: Exchange[] = [
  { id: "1", date: "2024-03-15", fromCurrency: "USD", toCurrency: "JPY", amountFrom: 500, amountTo: 73500, location: "Tokyo Airport", fee: 5 },
  { id: "2", date: "2024-03-18", fromCurrency: "USD", toCurrency: "JPY", amountFrom: 200, amountTo: 29000, location: "Kyoto Bank", fee: 2 },
  { id: "3", date: "2024-05-02", fromCurrency: "USD", toCurrency: "EUR", amountFrom: 300, amountTo: 276, location: "Rome Exchange", fee: 3 },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [exchanges, setExchanges] = useState<Exchange[]>(SEED.map((e) => ({ ...e })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addExchange = useCallback((e: Exchange) => setExchanges((prev) => [...prev, e]), []);
  return (
    <AppContext.Provider value={{ route, exchanges, navigate, addExchange }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
