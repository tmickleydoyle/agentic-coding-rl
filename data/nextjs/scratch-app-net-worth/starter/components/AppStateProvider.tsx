import React, { createContext, useContext } from "react";
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
  return (
    <AppContext.Provider value={{ route: "summary", assets: [], liabilities: [], snapshots: [], setRoute: () => {}, addAsset: () => {}, deleteAsset: () => {}, addLiability: () => {}, deleteLiability: () => {}, addSnapshot: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
