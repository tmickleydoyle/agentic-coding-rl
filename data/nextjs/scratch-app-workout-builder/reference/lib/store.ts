import { Exercise, Routine, WorkoutLog } from './types';

let exercises: Exercise[] = [
  { id: 'ex1', name: 'Push-up', category: 'strength', muscleGroup: 'chest', description: 'Basic push-up' },
  { id: 'ex2', name: 'Squat', category: 'strength', muscleGroup: 'legs', description: 'Bodyweight squat' },
  { id: 'ex3', name: 'Running', category: 'cardio', muscleGroup: 'full body', description: 'Outdoor run' },
];
let routines: Routine[] = [
  { id: 'r1', name: 'Morning Basics', exerciseIds: ['ex1', 'ex2'], estimatedMinutes: 20 },
];
let logs: WorkoutLog[] = [];
let nextExId = 4;
let nextRtId = 2;
let nextLogId = 1;

export function getExercises(): Exercise[] { return exercises; }
export function addExercise(name: string, category: Exercise['category'], muscleGroup: string, description: string): Exercise {
  if (!name.trim()) throw new Error('Name required');
  const ex: Exercise = { id: `ex${nextExId++}`, name: name.trim(), category, muscleGroup, description };
  exercises.push(ex);
  return ex;
}
export function deleteExercise(id: string): void {
  exercises = exercises.filter(e => e.id !== id);
  routines = routines.map(r => ({ ...r, exerciseIds: r.exerciseIds.filter(eid => eid !== id) }));
}

export function getRoutines(): Routine[] { return routines; }
export function addRoutine(name: string, exerciseIds: string[], estimatedMinutes: number): Routine {
  if (!name.trim()) throw new Error('Name required');
  const r: Routine = { id: `r${nextRtId++}`, name: name.trim(), exerciseIds, estimatedMinutes };
  routines.push(r);
  return r;
}
export function deleteRoutine(id: string): void {
  routines = routines.filter(r => r.id !== id);
}

export function getLogs(): WorkoutLog[] { return logs; }
export function addLog(routineId: string, date: string, durationMinutes: number, notes: string): WorkoutLog {
  if (durationMinutes <= 0) throw new Error('Duration must be positive');
  const log: WorkoutLog = { id: `log${nextLogId++}`, routineId, date, durationMinutes, notes };
  logs.push(log);
  return log;
}

export function __reset(): void {
  exercises = [
    { id: 'ex1', name: 'Push-up', category: 'strength', muscleGroup: 'chest', description: 'Basic push-up' },
    { id: 'ex2', name: 'Squat', category: 'strength', muscleGroup: 'legs', description: 'Bodyweight squat' },
    { id: 'ex3', name: 'Running', category: 'cardio', muscleGroup: 'full body', description: 'Outdoor run' },
  ];
  routines = [{ id: 'r1', name: 'Morning Basics', exerciseIds: ['ex1', 'ex2'], estimatedMinutes: 20 }];
  logs = [];
  nextExId = 4; nextRtId = 2; nextLogId = 1;
}
