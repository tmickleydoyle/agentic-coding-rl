import React, { createContext, useContext } from "react";
import type { Trip } from "../lib/types";

interface AppState {
  route: string;
  trips: Trip[];
  navigate: (r: string) => void;
  addTrip: (t: Trip) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  trips: [],
  navigate: () => {},
  addTrip: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", trips: [], navigate: () => {}, addTrip: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
