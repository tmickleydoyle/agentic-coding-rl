import React, { createContext, useContext, useState } from "react";
import { AppState, Route, Expense, Income } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
}

const defaultExpenses: Expense[] = [
  { id: "e1", description: "Rent", amount: 1500, category: "housing", date: "2024-01-01" },
  { id: "e2", description: "Groceries", amount: 200, category: "food", date: "2024-01-05" },
  { id: "e3", description: "Gas", amount: 80, category: "transport", date: "2024-01-10" },
];

const defaultIncomes: Income[] = [
  { id: "i1", source: "Salary", amount: 4000, date: "2024-01-01" },
  { id: "i2", source: "Freelance", amount: 500, date: "2024-01-15" },
];

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
  const [route, setRoute] = useState<Route>("home");
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [incomes, setIncomes] = useState<Income[]>(defaultIncomes);

  function addExpense(expense: Expense) {
    setExpenses((prev) => [...prev, expense]);
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function addIncome(income: Income) {
    setIncomes((prev) => [...prev, income]);
  }

  function deleteIncome(id: string) {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AppContext.Provider value={{ route, expenses, incomes, setRoute, addExpense, deleteExpense, addIncome, deleteIncome }}>
      {children}
    </AppContext.Provider>
  );
}
