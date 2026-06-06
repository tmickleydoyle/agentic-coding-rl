import React, { createContext, useContext } from "react";
import { Metric, Goal, HistoryEntry } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  metrics: Metric[];
  goals: Goal[];
  history: HistoryEntry[];
  setMetrics: (v: Metric[]) => void;
  setGoals: (v: Goal[]) => void;
  setHistory: (v: HistoryEntry[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  metrics: [],
  goals: [],
  history: [],
  setMetrics: () => {},
  setGoals: () => {},
  setHistory: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, metrics: [], goals: [], history: [], setMetrics: () => {}, setGoals: () => {}, setHistory: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
