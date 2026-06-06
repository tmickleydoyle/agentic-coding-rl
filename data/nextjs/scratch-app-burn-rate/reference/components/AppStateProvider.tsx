import React, { createContext, useContext, useState, useCallback } from "react";
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
  startingCash: 400000,
  setTransactions: () => {},
  setCategories: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", description: "Customer Revenue", amount: 30000, type: "Income", category: "Revenue", date: "2024-01" },
    { id: "2", description: "Payroll", amount: 55000, type: "Expense", category: "Payroll", date: "2024-01" },
    { id: "3", description: "AWS", amount: 4000, type: "Expense", category: "Infrastructure", date: "2024-01" },
    { id: "4", description: "Google Ads", amount: 8000, type: "Expense", category: "Marketing", date: "2024-01" },
    { id: "5", description: "Office", amount: 3000, type: "Expense", category: "G&A", date: "2024-01" },
  ]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Payroll" },
    { id: "2", name: "Infrastructure" },
    { id: "3", name: "Marketing" },
    { id: "4", name: "G&A" },
    { id: "5", name: "Revenue" },
  ]);
  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, transactions, categories, startingCash: 400000, setTransactions, setCategories }}>
      {children}
    </AppContext.Provider>
  );
}
