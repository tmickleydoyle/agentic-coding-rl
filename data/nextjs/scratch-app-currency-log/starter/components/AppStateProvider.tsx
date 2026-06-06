import React, { createContext, useContext } from "react";
import type { Exchange } from "../lib/types";

interface AppState {
  route: string;
  exchanges: Exchange[];
  navigate: (r: string) => void;
  addExchange: (e: Exchange) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  exchanges: [],
  navigate: () => {},
  addExchange: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", exchanges: [], navigate: () => {}, addExchange: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
