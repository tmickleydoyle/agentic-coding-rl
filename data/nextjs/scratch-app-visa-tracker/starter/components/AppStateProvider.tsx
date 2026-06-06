import React, { createContext, useContext } from "react";
import type { Visa } from "../lib/types";

interface AppState {
  route: string;
  visas: Visa[];
  navigate: (r: string) => void;
  addVisa: (v: Visa) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  visas: [],
  navigate: () => {},
  addVisa: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", visas: [], navigate: () => {}, addVisa: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
