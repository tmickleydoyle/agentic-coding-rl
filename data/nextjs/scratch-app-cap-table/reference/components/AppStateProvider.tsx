import React, { createContext, useContext, useState, useCallback } from "react";
import { Shareholder, Round } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  shareholders: Shareholder[];
  rounds: Round[];
  setShareholders: (v: Shareholder[]) => void;
  setRounds: (v: Round[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  shareholders: [],
  rounds: [],
  setShareholders: () => {},
  setRounds: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { id: "1", name: "Alice Founder", type: "Founder", shares: 4000000 },
    { id: "2", name: "Bob Founder", type: "Founder", shares: 3000000 },
    { id: "3", name: "Accel Fund", type: "Investor", shares: 2000000 },
    { id: "4", name: "Carol Advisor", type: "Advisor", shares: 100000 },
  ]);
  const [rounds, setRounds] = useState<Round[]>([
    { id: "1", name: "Seed", date: "2023-06-01", sharePrice: 1.00, newShares: 2000000 },
    { id: "2", name: "Series A", date: "2024-01-15", sharePrice: 5.00, newShares: 1000000 },
  ]);

  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, shareholders, rounds, setShareholders, setRounds }}>
      {children}
    </AppContext.Provider>
  );
}
