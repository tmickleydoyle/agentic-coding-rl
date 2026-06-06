import React, { createContext, useContext, useState, ReactNode } from "react";
import { Asset, Valuation } from "../lib/types";
import { getState, addAsset, deleteAsset, addValuation, deleteValuation } from "../lib/store";

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

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppStateProvider");
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const initial = getState();
  const [route, setRoute] = useState("/");
  const [assets, setAssets] = useState<Asset[]>(initial.assets);
  const [valuations, setValuations] = useState<Valuation[]>(initial.valuations);

  return (
    <AppContext.Provider value={{
      route, navigate: setRoute, assets, valuations,
      addAsset: (a) => { const n = addAsset(a); setAssets((p) => [...p, n]); },
      deleteAsset: (id) => { deleteAsset(id); setAssets((p) => p.filter((a) => a.id !== id)); },
      addValuation: (v) => { const n = addValuation(v); setValuations((p) => [...p, n]); },
      deleteValuation: (id) => { deleteValuation(id); setValuations((p) => p.filter((v) => v.id !== id)); },
    }}>
      {children}
    </AppContext.Provider>
  );
}
