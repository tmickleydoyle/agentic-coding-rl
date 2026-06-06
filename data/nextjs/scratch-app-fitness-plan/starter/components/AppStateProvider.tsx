import React, { createContext, useContext } from "react";
import { Workout, WorkoutType, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  workouts: Workout[];
  addWorkout: (name: string, type: WorkoutType, duration: number) => void;
  removeWorkout: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const Ctx = createContext<AppCtx>({
  route: "dashboard",
  setRoute: () => {},
  workouts: [],
  addWorkout: () => {},
  removeWorkout: () => {},
  toggleComplete: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "dashboard", setRoute: () => {}, workouts: [], addWorkout: () => {}, removeWorkout: () => {}, toggleComplete: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
