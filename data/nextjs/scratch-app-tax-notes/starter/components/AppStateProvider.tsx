import React, { createContext, useContext } from "react";
import { AppState, Route, TaxDocument, Deduction, TaxNote } from "../lib/types";
interface AppContextValue extends AppState {
  setRoute: (route: Route) => void;
  addDocument: (d: TaxDocument) => void;
  deleteDocument: (id: string) => void;
  addDeduction: (d: Deduction) => void;
  deleteDeduction: (id: string) => void;
  addTaxNote: (n: TaxNote) => void;
  deleteTaxNote: (id: string) => void;
}
export const AppContext = createContext<AppContextValue>({
  route: "overview", documents: [], deductions: [], taxNotes: [],
  setRoute: () => {}, addDocument: () => {}, deleteDocument: () => {},
  addDeduction: () => {}, deleteDeduction: () => {},
  addTaxNote: () => {}, deleteTaxNote: () => {},
});
export function useApp(): AppContextValue { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "overview", documents: [], deductions: [], taxNotes: [], setRoute: () => {}, addDocument: () => {}, deleteDocument: () => {}, addDeduction: () => {}, deleteDeduction: () => {}, addTaxNote: () => {}, deleteTaxNote: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
