'use client'
import React, { createContext, useContext } from 'react';
import { Exercise, Routine, WorkoutLog, Route } from '../lib/types';

interface AppState {
  route: Route; exercises: Exercise[]; routines: Routine[]; logs: WorkoutLog[];
  navigate: (r: Route) => void;
  addExercise: (name: string, category: Exercise['category'], muscleGroup: string, description: string) => boolean;
  deleteExercise: (id: string) => void;
  addRoutine: (name: string, exerciseIds: string[], estimatedMinutes: number) => boolean;
  deleteRoutine: (id: string) => void;
  addLog: (routineId: string, date: string, durationMinutes: number, notes: string) => boolean;
}

const AppContext = createContext<AppState>({
  route: 'home', exercises: [], routines: [], logs: [],
  navigate: () => {}, addExercise: () => false, deleteExercise: () => {},
  addRoutine: () => false, deleteRoutine: () => {}, addLog: () => false,
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', exercises: [], routines: [], logs: [],
      navigate: () => {}, addExercise: () => false, deleteExercise: () => {},
      addRoutine: () => false, deleteRoutine: () => {}, addLog: () => false,
    }}>
      {children}
    </AppContext.Provider>
  );
}
