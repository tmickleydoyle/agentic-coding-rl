import React, { createContext, useContext } from "react";
import { AppState, Route, Bill } from "../lib/types";
interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addBill: (b: Bill) => void;
  deleteBill: (id: string) => void;
  toggleBill: (id: string) => void;
}
export const AppContext = createContext<AppContextValue>({
  route: "dashboard", bills: [],
  setRoute: () => {}, addBill: () => {}, deleteBill: () => {}, toggleBill: () => {},
});
export function useApp(): AppContextValue { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "dashboard", bills: [], setRoute: () => {}, addBill: () => {}, deleteBill: () => {}, toggleBill: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
