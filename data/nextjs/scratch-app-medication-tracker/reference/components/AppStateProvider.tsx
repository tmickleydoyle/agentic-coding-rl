import React, { createContext, useContext, useState } from "react";
import type { AppState, Route, Medication, DoseLog } from "../lib/types";

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setMedications: (meds: Medication[]) => void;
  setDoseLogs: (logs: DoseLog[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home", medications: [], doseLogs: [],
  navigate: () => {}, setMedications: () => {}, setDoseLogs: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  return (
    <AppContext.Provider value={{ route, medications, doseLogs, navigate: setRoute, setMedications, setDoseLogs }}>
      {children}
    </AppContext.Provider>
  );
}
