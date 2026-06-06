import React, { createContext, useContext } from "react";
import type { Activity } from "../lib/types";

interface AppState {
  route: string;
  activities: Activity[];
  navigate: (r: string) => void;
  addActivity: (a: Activity) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  activities: [],
  navigate: () => {},
  addActivity: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", activities: [], navigate: () => {}, addActivity: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
