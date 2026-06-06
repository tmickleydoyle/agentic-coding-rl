import React, { createContext, useContext } from "react";
import { AppState, Route, Goal, Contribution } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addContribution: (c: Contribution) => void;
}

export const AppContext = createContext<AppContextValue>({
  route: "dashboard", goals: [], contributions: [],
  setRoute: () => {}, addGoal: () => {}, deleteGoal: () => {}, addContribution: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "dashboard", goals: [], contributions: [], setRoute: () => {}, addGoal: () => {}, deleteGoal: () => {}, addContribution: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
