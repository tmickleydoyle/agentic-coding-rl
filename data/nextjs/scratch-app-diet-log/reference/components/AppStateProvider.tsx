import React, { createContext, useContext, useState, useCallback } from "react";
import { DietEntry } from "../lib/types";
import { getEntries, addEntry, deleteEntry, getDailySummary } from "../lib/store";

type Route = "log" | "add-entry" | "summary";

interface Summary { calories: number; protein: number; carbs: number; fat: number; }

interface AppState {
  route: Route;
  entries: DietEntry[];
  summary: Summary;
  navigate: (r: Route) => void;
  handleAdd: (data: Omit<DietEntry, "id">) => void;
  handleDelete: (id: string) => void;
}

const Ctx = createContext<AppState>({ route: "log", entries: [], summary: { calories: 0, protein: 0, carbs: 0, fat: 0 }, navigate: () => {}, handleAdd: () => {}, handleDelete: () => {} });

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("log");
  const [entries, setEntries] = useState<DietEntry[]>(() => getEntries());
  const [summary, setSummary] = useState<Summary>(() => getDailySummary("2024-03-15"));

  const refresh = () => {
    setEntries(getEntries());
    setSummary(getDailySummary("2024-03-15"));
  };

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleAdd = useCallback((data: Omit<DietEntry, "id">) => {
    addEntry(data); refresh(); setRoute("log");
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id); refresh();
  }, []);

  return (
    <Ctx.Provider value={{ route, entries, summary, navigate, handleAdd, handleDelete }}>
      {children}
    </Ctx.Provider>
  );
}
