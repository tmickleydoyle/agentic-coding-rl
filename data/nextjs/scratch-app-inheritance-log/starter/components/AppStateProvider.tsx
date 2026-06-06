import React, { createContext, useContext, useState, ReactNode } from "react";
import { InheritanceEntry, Heir } from "../lib/types";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  entries: InheritanceEntry[];
  heirs: Heir[];
  addEntry: (e: Omit<InheritanceEntry, "id">) => void;
  deleteEntry: (id: string) => void;
  addHeir: (h: Omit<Heir, "id">) => void;
  deleteHeir: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  route: "/", navigate: () => {},
  entries: [], heirs: [],
  addEntry: () => {}, deleteEntry: () => {},
  addHeir: () => {}, deleteHeir: () => {},
});

export function useApp(): AppContextType {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState("/");
  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      entries: [], heirs: [],
      addEntry: () => {}, deleteEntry: () => {},
      addHeir: () => {}, deleteHeir: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
