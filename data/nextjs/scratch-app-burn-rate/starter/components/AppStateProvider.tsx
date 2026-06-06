import React, { createContext, useContext } from "react";
import { Transaction, Category } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  transactions: Transaction[];
  categories: Category[];
  startingCash: number;
  setTransactions: (v: Transaction[]) => void;
  setCategories: (v: Category[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  transactions: [],
  categories: [],
  startingCash: 0,
  setTransactions: () => {},
  setCategories: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, transactions: [], categories: [], startingCash: 0, setTransactions: () => {}, setCategories: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
