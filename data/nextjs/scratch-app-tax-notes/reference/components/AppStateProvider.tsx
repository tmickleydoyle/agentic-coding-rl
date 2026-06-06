import React, { createContext, useContext, useState } from "react";
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
  const [route, setRoute] = useState<Route>("overview");
  const [documents, setDocuments] = useState<TaxDocument[]>([
    { id: "doc1", name: "W-2 Employer", type: "w2", year: 2023, amount: 75000 },
    { id: "doc2", name: "1099-INT Bank", type: "1099", year: 2023, amount: 250 },
  ]);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: "ded1", description: "Home Office", amount: 1500, category: "business" },
    { id: "ded2", description: "Charitable Donations", amount: 800, category: "charitable" },
    { id: "ded3", description: "Medical Expenses", amount: 2200, category: "medical" },
  ]);
  const [taxNotes, setTaxNotes] = useState<TaxNote[]>([
    { id: "n1", title: "Deadline Reminder", content: "File by April 15", date: "2024-01-01" },
  ]);

  function addDocument(d: TaxDocument) { setDocuments((prev) => [...prev, d]); }
  function deleteDocument(id: string) { setDocuments((prev) => prev.filter((d) => d.id !== id)); }
  function addDeduction(d: Deduction) { setDeductions((prev) => [...prev, d]); }
  function deleteDeduction(id: string) { setDeductions((prev) => prev.filter((d) => d.id !== id)); }
  function addTaxNote(n: TaxNote) { setTaxNotes((prev) => [...prev, n]); }
  function deleteTaxNote(id: string) { setTaxNotes((prev) => prev.filter((n) => n.id !== id)); }

  return (
    <AppContext.Provider value={{ route, documents, deductions, taxNotes, setRoute, addDocument, deleteDocument, addDeduction, deleteDeduction, addTaxNote, deleteTaxNote }}>
      {children}
    </AppContext.Provider>
  );
}
