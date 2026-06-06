import React, { createContext, useContext, ReactNode } from "react";
import { Route } from "../lib/types";

interface AppState { route: Route; navigate: (r: Route) => void; }
const AppContext = createContext<AppState>({ route: "dashboard", navigate: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: ReactNode }) {
  return <AppContext.Provider value={{ route: "dashboard", navigate: () => {} }}>{children}</AppContext.Provider>;
}
