import React, { createContext, useContext } from "react";
import { Session, Route } from "../lib/types";

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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "sessions", setRoute: () => {}, sessions: [], activeSessionId: null, setActiveSessionId: () => {}, addSession: () => {}, deleteSession: () => {}, addExercise: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
