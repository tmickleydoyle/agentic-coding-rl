import React, { createContext, useContext, useState, ReactNode } from "react";
import { Trust, Distribution } from "../lib/types";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  trusts: Trust[];
  distributions: Distribution[];
  addTrust: (t: Omit<Trust, "id">) => void;
  deleteTrust: (id: string) => void;
  addDistribution: (d: Omit<Distribution, "id">) => void;
  deleteDistribution: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  route: "/", navigate: () => {},
  trusts: [], distributions: [],
  addTrust: () => {}, deleteTrust: () => {},
  addDistribution: () => {}, deleteDistribution: () => {},
});

export function useApp(): AppContextType {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState("/");
  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      trusts: [], distributions: [],
      addTrust: () => {}, deleteTrust: () => {},
      addDistribution: () => {}, deleteDistribution: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
