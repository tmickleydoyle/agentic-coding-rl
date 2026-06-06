import React, { createContext, useContext, useState, useCallback } from "react";
import type { JournalEntry } from "../lib/types";

interface AppState {
  route: string;
  entries: JournalEntry[];
  navigate: (r: string) => void;
  addEntry: (e: JournalEntry) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  entries: [],
  navigate: () => {},
  addEntry: () => {},
});

const SEED: JournalEntry[] = [
  { id: "1", title: "Arrival in Tokyo", country: "Japan", city: "Tokyo", date: "2024-03-15", mood: "happy", body: "Amazing first day!", rating: 5 },
  { id: "2", title: "Lost in Kyoto", country: "Japan", city: "Kyoto", date: "2024-03-18", mood: "happy", body: "Found hidden temples.", rating: 4 },
  { id: "3", title: "Rainy Rome", country: "Italy", city: "Rome", date: "2024-05-02", mood: "neutral", body: "Saw the Colosseum despite rain.", rating: 3 },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [entries, setEntries] = useState<JournalEntry[]>(SEED.map((e) => ({ ...e })));

  const navigate = useCallback((r: string) => setRoute(r), []);
  const addEntry = useCallback((e: JournalEntry) => setEntries((prev) => [...prev, e]), []);

  return (
    <AppContext.Provider value={{ route, entries, navigate, addEntry }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
