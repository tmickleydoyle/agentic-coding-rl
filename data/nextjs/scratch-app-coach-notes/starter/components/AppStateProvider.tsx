import React, { createContext, useContext } from "react";
import { Athlete, Level, CoachSession, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  athletes: Athlete[];
  sessions: CoachSession[];
  activeAthleteId: string | null;
  setActiveAthleteId: (id: string | null) => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  addAthlete: (name: string, sport: string, level: Level) => void;
  deleteAthlete: (id: string) => void;
  addSession: (athleteId: string, date: string, duration: number, focus: string) => void;
  addDrill: (sessionId: string, name: string, reps: number, notes: string) => void;
}

const Ctx = createContext<AppCtx>({
  route: "athletes",
  setRoute: () => {},
  athletes: [],
  sessions: [],
  activeAthleteId: null,
  setActiveAthleteId: () => {},
  activeSessionId: null,
  setActiveSessionId: () => {},
  addAthlete: () => {},
  deleteAthlete: () => {},
  addSession: () => {},
  addDrill: () => {},
});

export function useApp() { return useContext(Ctx); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "athletes", setRoute: () => {}, athletes: [], sessions: [], activeAthleteId: null, setActiveAthleteId: () => {}, activeSessionId: null, setActiveSessionId: () => {}, addAthlete: () => {}, deleteAthlete: () => {}, addSession: () => {}, addDrill: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
