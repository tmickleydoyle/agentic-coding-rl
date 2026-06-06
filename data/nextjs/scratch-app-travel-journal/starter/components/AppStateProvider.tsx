import React, { createContext, useContext } from "react";
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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", entries: [], navigate: () => {}, addEntry: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
