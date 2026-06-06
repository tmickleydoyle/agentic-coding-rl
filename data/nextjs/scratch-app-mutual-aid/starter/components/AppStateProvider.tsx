import React, { createContext, useContext, useState } from "react";
type Route = "requests" | "offers" | "matches";
interface AppState { route: Route; navigate: (r: Route) => void; }
const AppContext = createContext<AppState>({ route: "requests", navigate: () => {} });
export function useApp(): AppState { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("requests");
  return <AppContext.Provider value={{ route, navigate: setRoute }}>{children}</AppContext.Provider>;
}
