import React, { createContext, useContext } from "react";
import { AppState, Route, Expense, Income } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
}

export const AppContext = createContext<AppContextValue>({
  route: "home",
  expenses: [],
  incomes: [],
  setRoute: () => {},
  addExpense: () => {},
  deleteExpense: () => {},
  addIncome: () => {},
  deleteIncome: () => {},
});

export function useApp(): AppContextValue {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "home", expenses: [], incomes: [], setRoute: () => {}, addExpense: () => {}, deleteExpense: () => {}, addIncome: () => {}, deleteIncome: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
