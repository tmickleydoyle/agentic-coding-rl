import React, { createContext, useContext } from "react";
import type { PackingList } from "../lib/types";

interface AppState {
  route: string;
  lists: PackingList[];
  navigate: (r: string) => void;
  addList: (l: PackingList) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  lists: [],
  navigate: () => {},
  addList: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", lists: [], navigate: () => {}, addList: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
