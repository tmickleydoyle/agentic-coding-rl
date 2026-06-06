import React, { createContext, useContext, useState, useCallback } from "react";
import type { Expense, BudgetConfig } from "../lib/types";

interface AppState {
  route: string;
  expenses: Expense[];
  budget: BudgetConfig;
  navigate: (r: string) => void;
  addExpense: (e: Expense) => void;
}

const BUDGET: BudgetConfig = { totalBudget: 3000, tripName: "Japan Adventure", currency: "USD" };

const AppContext = createContext<AppState>({
  route: "/",
  expenses: [],
  budget: BUDGET,
  navigate: () => {},
  addExpense: () => {},
});

const SEED: Expense[] = [
  { id: "1", date: "2024-03-15", description: "Hotel check-in", category: "Accommodation", amount: 120, currency: "JPY", originalAmount: 17640 },
  { id: "2", date: "2024-03-15", description: "Ramen lunch", category: "Food", amount: 12, currency: "JPY", originalAmount: 1764 },
  { id: "3", date: "2024-03-16", description: "Shinkansen", category: "Transport", amount: 80, currency: "JPY", originalAmount: 11760 },
  { id: "4", date: "2024-03-16", description: "Temple entry", category: "Activities", amount: 5, currency: "JPY", originalAmount: 735 },
  { id: "5", date: "2024-03-17", description: "Souvenir shopping", category: "Shopping", amount: 60, currency: "JPY", originalAmount: 8820 },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [expenses, setExpenses] = useState<Expense[]>(SEED.map((e) => ({ ...e })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addExpense = useCallback((e: Expense) => setExpenses((prev) => [...prev, e]), []);
  return (
    <AppContext.Provider value={{ route, expenses, budget: BUDGET, navigate, addExpense }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
