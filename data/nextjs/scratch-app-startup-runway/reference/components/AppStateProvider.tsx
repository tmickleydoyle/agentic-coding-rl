import React, { createContext, useContext, useState, useCallback } from "react";
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
  settings: { cashBalance: 500000, targetRunway: 18 },
  setExpenses: () => {},
  setSettings: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", name: "Engineering Salaries", category: "Engineering", amount: 45000 },
    { id: "2", name: "Office Rent", category: "Operations", amount: 8000 },
    { id: "3", name: "Google Ads", category: "Marketing", amount: 5000 },
    { id: "4", name: "Sales Tools", category: "Sales", amount: 2000 },
  ]);
  const [settings, setSettings] = useState<Settings>({ cashBalance: 500000, targetRunway: 18 });

  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, expenses, settings, setExpenses, setSettings }}>
      {children}
    </AppContext.Provider>
  );
}
