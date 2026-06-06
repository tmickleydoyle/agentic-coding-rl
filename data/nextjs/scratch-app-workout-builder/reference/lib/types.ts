export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility';
  muscleGroup: string;
  description: string;
}

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  estimatedMinutes: number;
}

export interface WorkoutLog {
  id: string;
  routineId: string;
  date: string;
  durationMinutes: number;
  notes: string;
}

export type Route = 'home' | 'exercises' | 'routines' | 'log';
