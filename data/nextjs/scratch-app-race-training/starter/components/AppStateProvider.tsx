import React, { createContext, useContext } from "react";
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

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "plan", setRoute: () => {}, racePlan: { raceName: "City Marathon", distance: "42.2km", raceDate: "2024-10-15" }, runs: [], paceGoals: { easy: "6:00", tempo: "4:30", long: "5:30", race: "5:00" }, addRun: () => {}, deleteRun: () => {}, toggleRun: () => {}, savePaceGoals: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
