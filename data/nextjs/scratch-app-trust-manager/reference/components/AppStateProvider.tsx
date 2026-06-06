import React, { createContext, useContext, useState, ReactNode } from "react";
import { Trust, Distribution } from "../lib/types";
import { getState, addTrust, deleteTrust, addDistribution, deleteDistribution } from "../lib/store";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  trusts: Trust[];
  distributions: Distribution[];
  addTrust: (t: Omit<Trust, "id">) => void;
  deleteTrust: (id: string) => void;
  addDistribution: (d: Omit<Distribution, "id">) => void;
  deleteDistribution: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppStateProvider");
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const initial = getState();
  const [route, setRoute] = useState("/");
  const [trusts, setTrusts] = useState<Trust[]>(initial.trusts);
  const [distributions, setDistributions] = useState<Distribution[]>(initial.distributions);

  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      trusts, distributions,
      addTrust: (t) => { const n = addTrust(t); setTrusts((p) => [...p, n]); },
      deleteTrust: (id) => { deleteTrust(id); setTrusts((p) => p.filter((t) => t.id !== id)); },
      addDistribution: (d) => { const n = addDistribution(d); setDistributions((p) => [...p, n]); },
      deleteDistribution: (id) => { deleteDistribution(id); setDistributions((p) => p.filter((d) => d.id !== id)); },
    }}>
      {children}
    </AppContext.Provider>
  );
}
