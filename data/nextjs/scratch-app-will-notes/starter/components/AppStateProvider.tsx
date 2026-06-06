import React, { createContext, useContext, useState, ReactNode } from "react";
import { Clause, Witness } from "../lib/types";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  clauses: Clause[];
  witnesses: Witness[];
  addClause: (c: Omit<Clause, "id">) => void;
  deleteClause: (id: string) => void;
  addWitness: (name: string) => void;
  toggleWitness: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  route: "/",
  navigate: () => {},
  clauses: [],
  witnesses: [],
  addClause: () => {},
  deleteClause: () => {},
  addWitness: () => {},
  toggleWitness: () => {},
});

export function useApp(): AppContextType {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState("/");
  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      clauses: [], witnesses: [],
      addClause: () => {}, deleteClause: () => {},
      addWitness: () => {}, toggleWitness: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
