import React, { createContext, useContext } from "react";
import type { AppState, Route, MoodLog } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setLogs: (logs: MoodLog[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  logs: [],
  navigate: () => {},
  setLogs: () => {},
});

export function useApp(): AppContextValue {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "home", logs: [], navigate: () => {}, setLogs: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
