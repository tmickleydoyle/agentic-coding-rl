import React, { createContext, useContext, useState } from "react";
import type { AppState, Route, SleepEntry } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setEntries: (entries: SleepEntry[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home", entries: [], navigate: () => {}, setEntries: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  return (
    <AppContext.Provider value={{ route, entries, navigate: setRoute, setEntries }}>
      {children}
    </AppContext.Provider>
  );
}
