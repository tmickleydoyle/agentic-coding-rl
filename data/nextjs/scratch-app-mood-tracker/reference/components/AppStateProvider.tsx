import React, { createContext, useContext, useState } from "react";
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
  const [route, setRoute] = useState<Route>("home");
  const [logs, setLogs] = useState<MoodLog[]>([]);

  return (
    <AppContext.Provider value={{ route, logs, navigate: setRoute, setLogs }}>
      {children}
    </AppContext.Provider>
  );
}
