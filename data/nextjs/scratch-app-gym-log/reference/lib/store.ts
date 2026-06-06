import { Session, Exercise } from "./types";

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

let sessions: Session[] = SEED.map((s) => ({ ...s, exercises: s.exercises.map((e) => ({ ...e })) }));
let sCounter = 3;
let eCounter = 4;

export function __reset() {
  sessions = SEED.map((s) => ({ ...s, exercises: s.exercises.map((e) => ({ ...e })) }));
  sCounter = 3;
  eCounter = 4;
}

export function getSessions(): Session[] {
  return sessions;
}

export function addSession(name: string, date: string): Session | null {
  if (!name.trim()) return null;
  const s: Session = { id: `s${sCounter++}`, name: name.trim(), date, exercises: [] };
  sessions.push(s);
  return s;
}

export function deleteSession(id: string): void {
  sessions = sessions.filter((s) => s.id !== id);
}

export function addExercise(
  sessionId: string,
  name: string,
  sets: number,
  reps: number,
  weight: number
): Exercise | null {
  if (!name.trim() || sets < 1 || reps < 1 || weight < 0) return null;
  const s = sessions.find((x) => x.id === sessionId);
  if (!s) return null;
  const e: Exercise = { id: `e${eCounter++}`, name: name.trim(), sets, reps, weight };
  s.exercises.push(e);
  return e;
}
