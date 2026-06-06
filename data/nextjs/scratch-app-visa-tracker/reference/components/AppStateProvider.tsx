import React, { createContext, useContext, useState, useCallback } from "react";
import type { Visa } from "../lib/types";

interface AppState {
  route: string;
  visas: Visa[];
  navigate: (r: string) => void;
  addVisa: (v: Visa) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  visas: [],
  navigate: () => {},
  addVisa: () => {},
});

const SEED: Visa[] = [
  { id: "1", country: "Japan", visaType: "Tourist", appliedDate: "2024-01-10", expiryDate: "2024-06-10", status: "approved", passportNumber: "A1234567", notes: "3-month stay" },
  { id: "2", country: "USA", visaType: "Business", appliedDate: "2024-02-01", expiryDate: "2024-12-31", status: "approved", passportNumber: "A1234567", notes: "B1 visa" },
  { id: "3", country: "China", visaType: "Tourist", appliedDate: "2024-03-15", expiryDate: "2024-04-15", status: "expired", passportNumber: "A1234567", notes: "Expired" },
  { id: "4", country: "India", visaType: "eVisa", appliedDate: "2024-05-20", expiryDate: "2024-07-20", status: "applied", passportNumber: "A1234567", notes: "Pending" },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [visas, setVisas] = useState<Visa[]>(SEED.map((v) => ({ ...v })));
  const navigate = useCallback((r: string) => setRoute(r), []);
  const addVisa = useCallback((v: Visa) => setVisas((prev) => [...prev, v]), []);
  return (
    <AppContext.Provider value={{ route, visas, navigate, addVisa }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
