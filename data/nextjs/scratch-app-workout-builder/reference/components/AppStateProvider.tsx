'use client'
import React, { createContext, useContext, useState } from 'react';
import { Exercise, Routine, WorkoutLog, Route } from '../lib/types';

interface AppState {
  route: Route;
  exercises: Exercise[];
  routines: Routine[];
  logs: WorkoutLog[];
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
  const [route, setRoute] = useState<Route>('home');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 'ex1', name: 'Push-up', category: 'strength', muscleGroup: 'chest', description: 'Basic push-up' },
    { id: 'ex2', name: 'Squat', category: 'strength', muscleGroup: 'legs', description: 'Bodyweight squat' },
    { id: 'ex3', name: 'Running', category: 'cardio', muscleGroup: 'full body', description: 'Outdoor run' },
  ]);
  const [routines, setRoutines] = useState<Routine[]>([
    { id: 'r1', name: 'Morning Basics', exerciseIds: ['ex1', 'ex2'], estimatedMinutes: 20 },
  ]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [nextExId, setNextExId] = useState(4);
  const [nextRtId, setNextRtId] = useState(2);
  const [nextLogId, setNextLogId] = useState(1);

  const navigate = (r: Route) => setRoute(r);

  const addExercise = (name: string, category: Exercise['category'], muscleGroup: string, description: string): boolean => {
    if (!name.trim()) return false;
    setExercises(prev => [...prev, { id: `ex${nextExId}`, name: name.trim(), category, muscleGroup, description }]);
    setNextExId(n => n + 1);
    return true;
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
    setRoutines(prev => prev.map(r => ({ ...r, exerciseIds: r.exerciseIds.filter(eid => eid !== id) })));
  };

  const addRoutine = (name: string, exerciseIds: string[], estimatedMinutes: number): boolean => {
    if (!name.trim()) return false;
    setRoutines(prev => [...prev, { id: `r${nextRtId}`, name: name.trim(), exerciseIds, estimatedMinutes }]);
    setNextRtId(n => n + 1);
    return true;
  };

  const deleteRoutine = (id: string) => setRoutines(prev => prev.filter(r => r.id !== id));

  const addLog = (routineId: string, date: string, durationMinutes: number, notes: string): boolean => {
    if (durationMinutes <= 0) return false;
    setLogs(prev => [...prev, { id: `log${nextLogId}`, routineId, date, durationMinutes, notes }]);
    setNextLogId(n => n + 1);
    return true;
  };

  return (
    <AppContext.Provider value={{ route, exercises, routines, logs, navigate, addExercise, deleteExercise, addRoutine, deleteRoutine, addLog }}>
      {children}
    </AppContext.Provider>
  );
}
