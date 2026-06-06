import React, { createContext, useContext, useState } from "react";
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

const SEED: Workout[] = [
  { id: "w1", name: "Morning Run", type: "cardio", duration: 30, completed: false },
  { id: "w2", name: "Push Day", type: "strength", duration: 45, completed: false },
  { id: "w3", name: "Yoga Flow", type: "flexibility", duration: 20, completed: false },
];

let uidCounter = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("dashboard");
  const [workouts, setWorkouts] = useState<Workout[]>(SEED.map((w) => ({ ...w })));

  function addWorkout(name: string, type: WorkoutType, duration: number) {
    if (!name.trim() || duration <= 0) return;
    const w: Workout = { id: `w${uidCounter++}`, name: name.trim(), type, duration, completed: false };
    setWorkouts((prev) => [...prev, w]);
  }

  function removeWorkout(id: string) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  function toggleComplete(id: string) {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  }

  return (
    <Ctx.Provider value={{ route, setRoute, workouts, addWorkout, removeWorkout, toggleComplete }}>
      {children}
    </Ctx.Provider>
  );
}
