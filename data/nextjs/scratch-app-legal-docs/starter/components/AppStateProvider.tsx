import React, { createContext, useContext, useState } from "react";
import type { Route } from "../lib/types";

interface AppState {
  route: Route;
  navigate: (r: Route) => void;
}

const AppContext = createContext<AppState>({
  route: { name: "home" },
  navigate: () => {},
});

export function useApp(): AppState {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: "home" });
  return (
    <AppContext.Provider value={{ route, navigate: setRoute }}>
      {children}
    </AppContext.Provider>
  );
}
