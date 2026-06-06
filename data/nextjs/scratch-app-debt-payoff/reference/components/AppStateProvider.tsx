import React, { createContext, useContext, useState } from "react";
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
  const [route, setRoute] = useState<Route>("overview");
  const [debts, setDebts] = useState<Debt[]>([
    { id: "d1", name: "Credit Card", balance: 3000, interestRate: 22.9, minimumPayment: 60 },
    { id: "d2", name: "Car Loan", balance: 8000, interestRate: 6.5, minimumPayment: 200 },
    { id: "d3", name: "Student Loan", balance: 15000, interestRate: 4.5, minimumPayment: 150 },
  ]);
  const [payments, setPayments] = useState<Payment[]>([
    { id: "p1", debtId: "d1", amount: 200, date: "2024-01-05" },
    { id: "p2", debtId: "d2", amount: 300, date: "2024-01-10" },
  ]);

  function addDebt(d: Debt) { setDebts((prev) => [...prev, d]); }
  function deleteDebt(id: string) {
    setDebts((prev) => prev.filter((d) => d.id !== id));
    setPayments((prev) => prev.filter((p) => p.debtId !== id));
  }
  function addPayment(p: Payment) { setPayments((prev) => [...prev, p]); }

  return (
    <AppContext.Provider value={{ route, debts, payments, setRoute, addDebt, deleteDebt, addPayment }}>
      {children}
    </AppContext.Provider>
  );
}
