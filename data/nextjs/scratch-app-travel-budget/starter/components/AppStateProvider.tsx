import React, { createContext, useContext } from "react";
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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", expenses: [], budget: BUDGET, navigate: () => {}, addExpense: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
