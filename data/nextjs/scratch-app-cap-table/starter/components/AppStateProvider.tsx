import React, { createContext, useContext } from "react";
import { Shareholder, Round } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  shareholders: Shareholder[];
  rounds: Round[];
  setShareholders: (v: Shareholder[]) => void;
  setRounds: (v: Round[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  shareholders: [],
  rounds: [],
  setShareholders: () => {},
  setRounds: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, shareholders: [], rounds: [], setShareholders: () => {}, setRounds: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
