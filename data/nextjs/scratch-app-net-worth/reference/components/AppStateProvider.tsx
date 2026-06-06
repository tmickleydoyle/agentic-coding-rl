import React, { createContext, useContext, useState } from "react";
import { AppState, Route, Asset, Liability, Snapshot } from "../lib/types";

interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addAsset: (a: Asset) => void;
  deleteAsset: (id: string) => void;
  addLiability: (l: Liability) => void;
  deleteLiability: (id: string) => void;
  addSnapshot: (s: Snapshot) => void;
}

export const AppContext = createContext<AppContextValue>({
  route: "summary", assets: [], liabilities: [], snapshots: [],
  setRoute: () => {}, addAsset: () => {}, deleteAsset: () => {},
  addLiability: () => {}, deleteLiability: () => {}, addSnapshot: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("summary");
  const [assets, setAssets] = useState<Asset[]>([
    { id: "a1", name: "Checking Account", value: 5000, category: "cash" },
    { id: "a2", name: "Home", value: 350000, category: "real_estate" },
    { id: "a3", name: "401k", value: 85000, category: "retirement" },
  ]);
  const [liabilities, setLiabilities] = useState<Liability[]>([
    { id: "l1", name: "Mortgage", amount: 280000, category: "mortgage" },
    { id: "l2", name: "Car Loan", amount: 12000, category: "loan" },
  ]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([
    { id: "s1", date: "2024-01-01", netWorth: 147000 },
  ]);

  function addAsset(a: Asset) { setAssets((prev) => [...prev, a]); }
  function deleteAsset(id: string) { setAssets((prev) => prev.filter((a) => a.id !== id)); }
  function addLiability(l: Liability) { setLiabilities((prev) => [...prev, l]); }
  function deleteLiability(id: string) { setLiabilities((prev) => prev.filter((l) => l.id !== id)); }
  function addSnapshot(s: Snapshot) { setSnapshots((prev) => [...prev, s]); }

  return (
    <AppContext.Provider value={{ route, assets, liabilities, snapshots, setRoute, addAsset, deleteAsset, addLiability, deleteLiability, addSnapshot }}>
      {children}
    </AppContext.Provider>
  );
}
