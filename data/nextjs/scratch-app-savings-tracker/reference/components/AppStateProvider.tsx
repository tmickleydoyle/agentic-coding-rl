import React, { createContext, useContext, useState } from "react";
import { AppState, Route, Goal, Contribution } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addContribution: (c: Contribution) => void;
}

export const AppContext = createContext<AppContextValue>({
  route: "dashboard",
  goals: [],
  contributions: [],
  setRoute: () => {},
  addGoal: () => {},
  deleteGoal: () => {},
  addContribution: () => {},
});

export function useApp(): AppContextValue {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("dashboard");
  const [goals, setGoals] = useState<Goal[]>([
    { id: "g1", name: "Emergency Fund", target: 5000, deadline: "2024-12-31" },
    { id: "g2", name: "Vacation", target: 2000, deadline: "2024-06-30" },
  ]);
  const [contributions, setContributions] = useState<Contribution[]>([
    { id: "c1", goalId: "g1", amount: 500, date: "2024-01-10" },
    { id: "c2", goalId: "g1", amount: 750, date: "2024-02-01" },
    { id: "c3", goalId: "g2", amount: 300, date: "2024-01-15" },
  ]);

  function addGoal(goal: Goal) { setGoals((prev) => [...prev, goal]); }
  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setContributions((prev) => prev.filter((c) => c.goalId !== id));
  }
  function addContribution(c: Contribution) { setContributions((prev) => [...prev, c]); }

  return (
    <AppContext.Provider value={{ route, goals, contributions, setRoute, addGoal, deleteGoal, addContribution }}>
      {children}
    </AppContext.Provider>
  );
}
