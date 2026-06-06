import React, { createContext, useContext, useState, useCallback } from "react";
import { Investor, Interaction } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  investors: Investor[];
  interactions: Interaction[];
  setInvestors: (v: Investor[]) => void;
  setInteractions: (v: Interaction[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  investors: [],
  interactions: [],
  setInvestors: () => {},
  setInteractions: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [investors, setInvestors] = useState<Investor[]>([
    { id: "1", name: "Alice Chen", firm: "Accel", email: "alice@accel.com", stage: "Meeting" },
    { id: "2", name: "Bob Patel", firm: "Sequoia", email: "bob@sequoia.com", stage: "Term Sheet" },
    { id: "3", name: "Carol Wu", firm: "Andreessen", email: "carol@a16z.com", stage: "Lead" },
    { id: "4", name: "Dan Kim", firm: "Benchmark", email: "dan@benchmark.com", stage: "Contacted" },
  ]);
  const [interactions, setInteractions] = useState<Interaction[]>([
    { id: "1", investorId: "1", type: "Meeting", notes: "Intro call went well", date: "2024-01-15" },
    { id: "2", investorId: "2", type: "Email", notes: "Sent deck", date: "2024-01-20" },
  ]);

  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, investors, interactions, setInvestors, setInteractions }}>
      {children}
    </AppContext.Provider>
  );
}
