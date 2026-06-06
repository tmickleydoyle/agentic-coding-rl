import React, { createContext, useContext, useState } from "react";
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
  const [route, setRoute] = useState<Route>("dashboard");
  const [bills, setBills] = useState<Bill[]>([
    { id: "b1", name: "Rent", amount: 1500, dueDay: 1, category: "housing", isActive: true },
    { id: "b2", name: "Electric", amount: 120, dueDay: 15, category: "utilities", isActive: true },
    { id: "b3", name: "Internet", amount: 60, dueDay: 20, category: "utilities", isActive: true },
    { id: "b4", name: "Gym", amount: 45, dueDay: 5, category: "health", isActive: false },
  ]);

  function addBill(b: Bill) { setBills((prev) => [...prev, b]); }
  function deleteBill(id: string) { setBills((prev) => prev.filter((b) => b.id !== id)); }
  function toggleBill(id: string) { setBills((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b)); }

  return (
    <AppContext.Provider value={{ route, bills, setRoute, addBill, deleteBill, toggleBill }}>
      {children}
    </AppContext.Provider>
  );
}
