import React, { createContext, useContext } from "react";
import type { AppState, Route, BPReading } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setReadings: (readings: BPReading[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home", readings: [], navigate: () => {}, setReadings: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "home", readings: [], navigate: () => {}, setReadings: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
