import { Exercise, Routine, WorkoutLog } from './types';

export function getExercises(): Exercise[] { return []; }
export function addExercise(_name: string, _category: Exercise['category'], _muscleGroup: string, _description: string): Exercise { throw new Error('Not implemented'); }
export function deleteExercise(_id: string): void {}
export function getRoutines(): Routine[] { return []; }
export function addRoutine(_name: string, _exerciseIds: string[], _estimatedMinutes: number): Routine { throw new Error('Not implemented'); }
export function deleteRoutine(_id: string): void {}
export function getLogs(): WorkoutLog[] { return []; }
export function addLog(_routineId: string, _date: string, _durationMinutes: number, _notes: string): WorkoutLog { throw new Error('Not implemented'); }
export function __reset(): void {}
