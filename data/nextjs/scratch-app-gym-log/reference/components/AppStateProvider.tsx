import React, { createContext, useContext, useState } from "react";
import { Session, Exercise, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  sessions: Session[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  addSession: (name: string, date: string) => void;
  deleteSession: (id: string) => void;
  addExercise: (sessionId: string, name: string, sets: number, reps: number, weight: number) => void;
}

const Ctx = createContext<AppCtx>({
  route: "sessions",
  setRoute: () => {},
  sessions: [],
  activeSessionId: null,
  setActiveSessionId: () => {},
  addSession: () => {},
  deleteSession: () => {},
  addExercise: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

const SEED: Session[] = [
  {
    id: "s1",
    name: "Monday Chest",
    date: "2024-01-15",
    exercises: [{ id: "e1", name: "Bench Press", sets: 3, reps: 10, weight: 80 }],
  },
  {
    id: "s2",
    name: "Wednesday Back",
    date: "2024-01-17",
    exercises: [
      { id: "e2", name: "Deadlift", sets: 4, reps: 5, weight: 120 },
      { id: "e3", name: "Pull-up", sets: 3, reps: 8, weight: 0 },
    ],
  },
];

let uidS = 3;
let uidE = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("sessions");
  const [sessions, setSessions] = useState<Session[]>(
    SEED.map((s) => ({ ...s, exercises: s.exercises.map((e) => ({ ...e })) }))
  );
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);

  function setActiveSessionId(id: string | null) {
    setActiveSessionIdState(id);
  }

  function addSession(name: string, date: string) {
    if (!name.trim()) return;
    const s: Session = { id: `s${uidS++}`, name: name.trim(), date, exercises: [] };
    setSessions((prev) => [...prev, s]);
  }

  function deleteSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setActiveSessionIdState((prev) => (prev === id ? null : prev));
  }

  function addExercise(sessionId: string, name: string, sets: number, reps: number, weight: number) {
    if (!name.trim() || sets < 1 || reps < 1 || weight < 0) return;
    const e: Exercise = { id: `e${uidE++}`, name: name.trim(), sets, reps, weight };
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, exercises: [...s.exercises, e] } : s))
    );
  }

  return (
    <Ctx.Provider value={{ route, setRoute, sessions, activeSessionId, setActiveSessionId, addSession, deleteSession, addExercise }}>
      {children}
    </Ctx.Provider>
  );
}
