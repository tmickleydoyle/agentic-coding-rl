import React, { createContext, useContext, useState, ReactNode } from "react";
import { InheritanceEntry, Heir } from "../lib/types";
import { getState, addEntry, deleteEntry, addHeir, deleteHeir } from "../lib/store";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  entries: InheritanceEntry[];
  heirs: Heir[];
  addEntry: (e: Omit<InheritanceEntry, "id">) => void;
  deleteEntry: (id: string) => void;
  addHeir: (h: Omit<Heir, "id">) => void;
  deleteHeir: (id: string) => void;
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
  const [entries, setEntries] = useState<InheritanceEntry[]>(initial.entries);
  const [heirs, setHeirs] = useState<Heir[]>(initial.heirs);

  const handleAddEntry = (e: Omit<InheritanceEntry, "id">) => {
    const newE = addEntry(e);
    setEntries((prev) => [...prev, newE]);
  };
  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };
  const handleAddHeir = (h: Omit<Heir, "id">) => {
    const newH = addHeir(h);
    setHeirs((prev) => [...prev, newH]);
  };
  const handleDeleteHeir = (id: string) => {
    deleteHeir(id);
    setHeirs((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <AppContext.Provider value={{
      route, navigate: setRoute,
      entries, heirs,
      addEntry: handleAddEntry, deleteEntry: handleDeleteEntry,
      addHeir: handleAddHeir, deleteHeir: handleDeleteHeir,
    }}>
      {children}
    </AppContext.Provider>
  );
}
