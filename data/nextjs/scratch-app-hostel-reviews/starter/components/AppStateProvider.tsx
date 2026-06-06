import React, { createContext, useContext } from "react";
import type { HostelReview } from "../lib/types";

interface AppState {
  route: string;
  reviews: HostelReview[];
  navigate: (r: string) => void;
  addReview: (r: HostelReview) => void;
}

const AppContext = createContext<AppState>({
  route: "/",
  reviews: [],
  navigate: () => {},
  addReview: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", reviews: [], navigate: () => {}, addReview: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  return useContext(AppContext);
}
