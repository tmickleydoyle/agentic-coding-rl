import React, { createContext, useContext } from "react";
import { AppState, Route, FinancialGoal } from "../lib/types";
interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addGoal: (g: FinancialGoal) => void;
  deleteGoal: (id: string) => void;
  updateSaved: (id: string, amount: number) => void;
}
export const AppContext = createContext<AppContextValue>({
  route: "dashboard", goals: [],
  setRoute: () => {}, addGoal: () => {}, deleteGoal: () => {}, updateSaved: () => {},
});
export function useApp(): AppContextValue { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "dashboard", goals: [], setRoute: () => {}, addGoal: () => {}, deleteGoal: () => {}, updateSaved: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
