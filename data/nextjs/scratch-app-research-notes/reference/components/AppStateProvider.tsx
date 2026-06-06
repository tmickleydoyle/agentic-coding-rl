import React, { createContext, useContext, useState } from "react";
import { Route } from "../lib/types";

interface AppState {
  route: Route;
  navigate: (r: Route) => void;
}

const AppContext = createContext<AppState>({
  route: "research",
  navigate: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("research");
  return (
    <AppContext.Provider value={{ route, navigate: setRoute }}>
      {children}
    </AppContext.Provider>
  );
}
