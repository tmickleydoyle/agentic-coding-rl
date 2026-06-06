import React, { createContext, useContext, useState } from "react";
import type { AppState, Route, Allergy, ReactionLog } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setAllergies: (allergies: Allergy[]) => void;
  setReactions: (reactions: ReactionLog[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home", allergies: [], reactions: [],
  navigate: () => {}, setAllergies: () => {}, setReactions: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [reactions, setReactions] = useState<ReactionLog[]>([]);
  return (
    <AppContext.Provider value={{ route, allergies, reactions, navigate: setRoute, setAllergies, setReactions }}>
      {children}
    </AppContext.Provider>
  );
}
