import React, { createContext, useContext } from "react";
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
  return (
    <AppContext.Provider value={{ route: "home", medications: [], doseLogs: [], navigate: () => {}, setMedications: () => {}, setDoseLogs: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
