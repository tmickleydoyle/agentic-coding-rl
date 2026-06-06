import React, { createContext, useContext, useState, ReactNode } from "react";
import { Clause, Witness } from "../lib/types";
import { getState, addClause, deleteClause, addWitness, toggleWitness } from "../lib/store";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  clauses: Clause[];
  witnesses: Witness[];
  addClause: (c: Omit<Clause, "id">) => void;
  deleteClause: (id: string) => void;
  addWitness: (name: string) => void;
  toggleWitness: (id: string) => void;
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
  const [clauses, setClauses] = useState<Clause[]>(initial.clauses);
  const [witnesses, setWitnesses] = useState<Witness[]>(initial.witnesses);

  const handleAddClause = (c: Omit<Clause, "id">) => {
    const newC = addClause(c);
    setClauses((prev) => [...prev, newC]);
  };

  const handleDeleteClause = (id: string) => {
    deleteClause(id);
    setClauses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddWitness = (name: string) => {
    const w = addWitness(name);
    setWitnesses((prev) => [...prev, w]);
  };

  const handleToggle = (id: string) => {
    toggleWitness(id);
    setWitnesses((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === "Signed" ? "Pending" : "Signed" } : w))
    );
  };

  return (
    <AppContext.Provider value={{
      route,
      navigate: setRoute,
      clauses,
      witnesses,
      addClause: handleAddClause,
      deleteClause: handleDeleteClause,
      addWitness: handleAddWitness,
      toggleWitness: handleToggle,
    }}>
      {children}
    </AppContext.Provider>
  );
}
