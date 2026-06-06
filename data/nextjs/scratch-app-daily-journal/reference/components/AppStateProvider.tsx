import React, { createContext, useContext, useState } from "react";
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
  const [route, setRoute] = useState<Route>("home");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        route,
        entries,
        selectedEntryId,
        navigate: setRoute,
        setEntries,
        selectEntry: setSelectedEntryId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
