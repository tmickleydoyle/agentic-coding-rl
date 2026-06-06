import React, { createContext, useContext } from "react";
import type { AppState, Route, JournalEntry } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setEntries: (entries: JournalEntry[]) => void;
  selectEntry: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  entries: [],
  selectedEntryId: null,
  navigate: () => {},
  setEntries: () => {},
  selectEntry: () => {},
});

export function useApp(): AppContextValue {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider
      value={{
        route: "home",
        entries: [],
        selectedEntryId: null,
        navigate: () => {},
        setEntries: () => {},
        selectEntry: () => {},
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
