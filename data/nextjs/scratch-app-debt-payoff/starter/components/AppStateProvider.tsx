import React, { createContext, useContext } from "react";
import { AppState, Route, Debt, Payment } from "../lib/types";
interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addDebt: (d: Debt) => void;
  deleteDebt: (id: string) => void;
  addPayment: (p: Payment) => void;
}
export const AppContext = createContext<AppContextValue>({
  route: "overview", debts: [], payments: [],
  setRoute: () => {}, addDebt: () => {}, deleteDebt: () => {}, addPayment: () => {},
});
export function useApp(): AppContextValue { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "overview", debts: [], payments: [], setRoute: () => {}, addDebt: () => {}, deleteDebt: () => {}, addPayment: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
