import React, { createContext, useContext } from "react";
import { Investor, Interaction } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  investors: Investor[];
  interactions: Interaction[];
  setInvestors: (v: Investor[]) => void;
  setInteractions: (v: Interaction[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  investors: [],
  interactions: [],
  setInvestors: () => {},
  setInteractions: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, investors: [], interactions: [], setInvestors: () => {}, setInteractions: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
