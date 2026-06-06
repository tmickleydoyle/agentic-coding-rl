import React, { createContext, useContext } from "react";
import type { AppState, Route, StepEntry, StepGoal } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setEntries: (entries: StepEntry[]) => void;
  setGoal: (goal: StepGoal) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home", entries: [], goal: { dailyTarget: 10000 },
  navigate: () => {}, setEntries: () => {}, setGoal: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "home", entries: [], goal: { dailyTarget: 10000 }, navigate: () => {}, setEntries: () => {}, setGoal: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
