import React, { createContext, useContext } from "react";
import { Expense, Settings } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  expenses: Expense[];
  settings: Settings;
  setExpenses: (e: Expense[]) => void;
  setSettings: (s: Settings) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  expenses: [],
  settings: { cashBalance: 0, targetRunway: 0 },
  setExpenses: () => {},
  setSettings: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: "/", navigate: () => {}, expenses: [], settings: { cashBalance: 0, targetRunway: 0 }, setExpenses: () => {}, setSettings: () => {} }}>{children}</AppContext.Provider>;
}
