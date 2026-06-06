import React, { createContext, useContext, useState } from "react";
import { Run, RunType, RacePlan, PaceGoals, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  racePlan: RacePlan;
  runs: Run[];
  paceGoals: PaceGoals;
  addRun: (type: RunType, distance: number, date: string) => void;
  deleteRun: (id: string) => void;
  toggleRun: (id: string) => void;
  savePaceGoals: (goals: PaceGoals) => void;
}

const Ctx = createContext<AppCtx>({
  route: "plan",
  setRoute: () => {},
  racePlan: { raceName: "City Marathon", distance: "42.2km", raceDate: "2024-10-15" },
  runs: [],
  paceGoals: { easy: "6:00", tempo: "4:30", long: "5:30", race: "5:00" },
  addRun: () => {},
  deleteRun: () => {},
  toggleRun: () => {},
  savePaceGoals: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

const SEED_RUNS: Run[] = [
  { id: "r1", type: "easy", distance: 8, date: "2024-07-01", completed: false },
  { id: "r2", type: "tempo", distance: 6, date: "2024-07-03", completed: false },
  { id: "r3", type: "long", distance: 20, date: "2024-07-07", completed: false },
];

let uid = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("plan");
  const [runs, setRuns] = useState<Run[]>(SEED_RUNS.map((r) => ({ ...r })));
  const [paceGoals, setPaceGoals] = useState<PaceGoals>({ easy: "6:00", tempo: "4:30", long: "5:30", race: "5:00" });
  const racePlan: RacePlan = { raceName: "City Marathon", distance: "42.2km", raceDate: "2024-10-15" };

  function addRun(type: RunType, distance: number, date: string) {
    if (distance <= 0 || !date.trim()) return;
    const r: Run = { id: `r${uid++}`, type, distance, date, completed: false };
    setRuns((prev) => [...prev, r]);
  }

  function deleteRun(id: string) {
    setRuns((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleRun(id: string) {
    setRuns((prev) => prev.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  }

  function savePaceGoals(goals: PaceGoals) {
    setPaceGoals(goals);
  }

  return (
    <Ctx.Provider value={{ route, setRoute, racePlan, runs, paceGoals, addRun, deleteRun, toggleRun, savePaceGoals }}>
      {children}
    </Ctx.Provider>
  );
}
