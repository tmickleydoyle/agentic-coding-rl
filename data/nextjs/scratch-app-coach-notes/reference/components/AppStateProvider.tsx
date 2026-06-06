import React, { createContext, useContext, useState } from "react";
import { Athlete, Level, CoachSession, Drill, Route } from "../lib/types";

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

const SEED_ATHLETES: Athlete[] = [
  { id: "a1", name: "Alex Chen", sport: "Swimming", level: "advanced" },
  { id: "a2", name: "Maria Lopez", sport: "Track", level: "intermediate" },
];

const SEED_SESSIONS: CoachSession[] = [
  { id: "s1", athleteId: "a1", date: "2024-05-01", duration: 90, focus: "Butterfly technique", drills: [{ id: "d1", name: "Arm Drill", reps: 10, notes: "Focus on pull" }] },
  { id: "s2", athleteId: "a2", date: "2024-05-02", duration: 60, focus: "Sprint starts", drills: [] },
];

let uid_a = 3;
let uid_s = 3;
let uid_d = 2;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("athletes");
  const [athletes, setAthletes] = useState<Athlete[]>(SEED_ATHLETES.map((a) => ({ ...a })));
  const [sessions, setSessions] = useState<CoachSession[]>(SEED_SESSIONS.map((s) => ({ ...s, drills: s.drills.map((d) => ({ ...d })) })));
  const [activeAthleteId, setActiveAthleteId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  function addAthlete(name: string, sport: string, level: Level) {
    if (!name.trim()) return;
    const a: Athlete = { id: `a${uid_a++}`, name: name.trim(), sport, level };
    setAthletes((prev) => [...prev, a]);
  }

  function deleteAthlete(id: string) {
    setAthletes((prev) => prev.filter((a) => a.id !== id));
    setActiveAthleteId((prev) => prev === id ? null : prev);
  }

  function addSession(athleteId: string, date: string, duration: number, focus: string) {
    if (duration <= 0) return;
    const s: CoachSession = { id: `s${uid_s++}`, athleteId, date, duration, focus, drills: [] };
    setSessions((prev) => [...prev, s]);
  }

  function addDrill(sessionId: string, name: string, reps: number, notes: string) {
    if (reps < 1) return;
    const d: Drill = { id: `d${uid_d++}`, name, reps, notes };
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, drills: [...s.drills, d] } : s));
  }

  return (
    <Ctx.Provider value={{ route, setRoute, athletes, sessions, activeAthleteId, setActiveAthleteId, activeSessionId, setActiveSessionId, addAthlete, deleteAthlete, addSession, addDrill }}>
      {children}
    </Ctx.Provider>
  );
}
