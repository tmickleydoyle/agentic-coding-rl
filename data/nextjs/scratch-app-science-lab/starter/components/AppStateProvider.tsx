import React, { createContext, useContext, useState } from "react";
import type { Route, Experiment, Equipment, LabResult } from "../lib/types";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  experiments: Experiment[];
  setExperiments: (e: Experiment[]) => void;
  equipment: Equipment[];
  setEquipment: (e: Equipment[]) => void;
  results: LabResult[];
  setResults: (r: LabResult[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  experiments: [],
  setExperiments: () => {},
  equipment: [],
  setEquipment: () => {},
  results: [],
  setResults: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [results, setResults] = useState<LabResult[]>([]);
  return (
    <AppContext.Provider value={{ route, setRoute, experiments, setExperiments, equipment, setEquipment, results, setResults }}>
      {children}
    </AppContext.Provider>
  );
}
