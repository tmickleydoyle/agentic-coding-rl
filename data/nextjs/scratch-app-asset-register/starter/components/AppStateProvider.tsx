import React, { createContext, useContext, useState, ReactNode } from "react";
import { Asset, Valuation } from "../lib/types";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  assets: Asset[];
  valuations: Valuation[];
  addAsset: (a: Omit<Asset, "id">) => void;
  deleteAsset: (id: string) => void;
  addValuation: (v: Omit<Valuation, "id">) => void;
  deleteValuation: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  route: "/", navigate: () => {},
  assets: [], valuations: [],
  addAsset: () => {}, deleteAsset: () => {},
  addValuation: () => {}, deleteValuation: () => {},
});

export function useApp(): AppContextType {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState("/");
  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      assets: [], valuations: [],
      addAsset: () => {}, deleteAsset: () => {},
      addValuation: () => {}, deleteValuation: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
