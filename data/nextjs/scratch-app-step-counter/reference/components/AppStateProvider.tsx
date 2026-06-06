import React, { createContext, useContext, useState } from "react";
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
  const [route, setRoute] = useState<Route>("home");
  const [entries, setEntries] = useState<StepEntry[]>([]);
  const [goal, setGoal] = useState<StepGoal>({ dailyTarget: 10000 });
  return (
    <AppContext.Provider value={{ route, entries, goal, navigate: setRoute, setEntries, setGoal }}>
      {children}
    </AppContext.Provider>
  );
}
