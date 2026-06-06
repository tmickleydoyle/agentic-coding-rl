import { Athlete, CoachSession, Drill } from "./types";

const SEED_ATHLETES: Athlete[] = [
  { id: "a1", name: "Alex Chen", sport: "Swimming", level: "advanced" },
  { id: "a2", name: "Maria Lopez", sport: "Track", level: "intermediate" },
];

const SEED_SESSIONS: CoachSession[] = [
  { id: "s1", athleteId: "a1", date: "2024-05-01", duration: 90, focus: "Butterfly technique", drills: [{ id: "d1", name: "Arm Drill", reps: 10, notes: "Focus on pull" }] },
  { id: "s2", athleteId: "a2", date: "2024-05-02", duration: 60, focus: "Sprint starts", drills: [] },
];

let athletes: Athlete[] = SEED_ATHLETES.map((a) => ({ ...a }));
let sessions: CoachSession[] = SEED_SESSIONS.map((s) => ({ ...s, drills: s.drills.map((d) => ({ ...d })) }));
let aCounter = 3;
let sCounter = 3;
let dCounter = 2;

export function __reset() {
  athletes = SEED_ATHLETES.map((a) => ({ ...a }));
  sessions = SEED_SESSIONS.map((s) => ({ ...s, drills: s.drills.map((d) => ({ ...d })) }));
  aCounter = 3;
  sCounter = 3;
  dCounter = 2;
}

export function getAthletes(): Athlete[] { return athletes; }
export function getSessions(): CoachSession[] { return sessions; }

export function addAthlete(name: string, sport: string, level: Athlete["level"]): Athlete | null {
  if (!name.trim()) return null;
  const a: Athlete = { id: `a${aCounter++}`, name: name.trim(), sport, level };
  athletes.push(a);
  return a;
}

export function deleteAthlete(id: string): void {
  athletes = athletes.filter((a) => a.id !== id);
}

export function addSession(athleteId: string, date: string, duration: number, focus: string): CoachSession | null {
  if (duration <= 0) return null;
  const s: CoachSession = { id: `s${sCounter++}`, athleteId, date, duration, focus, drills: [] };
  sessions.push(s);
  return s;
}

export function addDrill(sessionId: string, name: string, reps: number, notes: string): Drill | null {
  if (reps < 1) return null;
  const s = sessions.find((x) => x.id === sessionId);
  if (!s) return null;
  const d: Drill = { id: `d${dCounter++}`, name, reps, notes };
  s.drills.push(d);
  return d;
}
