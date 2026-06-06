import React, { createContext, useContext, useState } from "react";
import { AppState, Route, FinancialGoal } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addGoal: (g: FinancialGoal) => void;
  deleteGoal: (id: string) => void;
  updateSaved: (id: string, amount: number) => void;
}

export const AppContext = createContext<AppContextValue>({
  route: "dashboard", goals: [],
  setRoute: () => {}, addGoal: () => {}, deleteGoal: () => {}, updateSaved: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("dashboard");
  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: "fg1", title: "Buy a Car", targetAmount: 20000, savedAmount: 8000, category: "purchase", status: "active" },
    { id: "fg2", title: "Emergency Fund", targetAmount: 10000, savedAmount: 10000, category: "savings", status: "completed" },
    { id: "fg3", title: "Down Payment", targetAmount: 50000, savedAmount: 15000, category: "purchase", status: "active" },
    { id: "fg4", title: "Vacation", targetAmount: 3000, savedAmount: 2700, category: "lifestyle", status: "active" },
  ]);

  function addGoal(g: FinancialGoal) { setGoals((prev) => [...prev, g]); }
  function deleteGoal(id: string) { setGoals((prev) => prev.filter((g) => g.id !== id)); }
  function updateSaved(id: string, amount: number) {
    setGoals((prev) => prev.map((g) =>
      g.id === id ? { ...g, savedAmount: amount, status: amount >= g.targetAmount ? "completed" : g.status } : g
    ));
  }

  return (
    <AppContext.Provider value={{ route, goals, setRoute, addGoal, deleteGoal, updateSaved }}>
      {children}
    </AppContext.Provider>
  );
}
