import React, { createContext, useContext } from "react";
import { Route } from "../lib/types";

interface AppState { route: Route; navigate: (r: Route) => void; }
const AppContext = createContext<AppState>({ route: "meetings", navigate: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: "meetings", navigate: () => {} }}>{children}</AppContext.Provider>;
}
