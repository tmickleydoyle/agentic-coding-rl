import React, { createContext, useContext } from "react";
import { AppState, Route, Holding, Transaction } from "../lib/types";
interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addHolding: (h: Holding) => void;
  deleteHolding: (id: string) => void;
  addTransaction: (t: Transaction) => void;
}
export const AppContext = createContext<AppContextValue>({
  route: "portfolio", holdings: [], transactions: [],
  setRoute: () => {}, addHolding: () => {}, deleteHolding: () => {}, addTransaction: () => {},
});
export function useApp(): AppContextValue { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "portfolio", holdings: [], transactions: [], setRoute: () => {}, addHolding: () => {}, deleteHolding: () => {}, addTransaction: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
