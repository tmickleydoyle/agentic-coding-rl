import React, { createContext, useContext, useState } from "react";
type Route = "inventory" | "donations" | "clients";
interface AppState { route: Route; navigate: (r: Route) => void; }
const AppContext = createContext<AppState>({ route: "inventory", navigate: () => {} });
export function useApp(): AppState { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("inventory");
  return <AppContext.Provider value={{ route, navigate: setRoute }}>{children}</AppContext.Provider>;
}
