import React, { createContext, useContext } from "react";
import type { AppState, Route, WeightEntry, WeightUnit } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setEntries: (entries: WeightEntry[]) => void;
  setUnit: (unit: WeightUnit) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home", entries: [], unit: "kg",
  navigate: () => {}, setEntries: () => {}, setUnit: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "home", entries: [], unit: "kg", navigate: () => {}, setEntries: () => {}, setUnit: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
