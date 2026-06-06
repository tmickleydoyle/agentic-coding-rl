import React, { createContext, useContext, useState } from "react";
import type { Route, Problem, DrillSession, Score } from "../lib/types";
import { getProblems, getDrills, getScores } from "../lib/store";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  problems: Problem[];
  setProblems: (p: Problem[]) => void;
  drills: DrillSession[];
  setDrills: (d: DrillSession[]) => void;
  scores: Score[];
  setScores: (s: Score[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  problems: [],
  setProblems: () => {},
  drills: [],
  setDrills: () => {},
  scores: [],
  setScores: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [problems, setProblems] = useState<Problem[]>(getProblems());
  const [drills, setDrills] = useState<DrillSession[]>(getDrills());
  const [scores, setScores] = useState<Score[]>(getScores());
  return (
    <AppContext.Provider value={{ route, setRoute, problems, setProblems, drills, setDrills, scores, setScores }}>
      {children}
    </AppContext.Provider>
  );
}
