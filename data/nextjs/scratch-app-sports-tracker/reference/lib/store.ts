import { Athlete, Session } from "./types";

const seedAthletes: Athlete[] = [
  { id: 1, name: "Alice Johnson", sport: "Soccer", position: "Forward" },
  { id: 2, name: "Bob Smith", sport: "Basketball", position: "Guard" },
];

const seedSessions: Session[] = [
  { id: 1, athleteId: 1, date: "2024-01-10", duration: 60, score: 8 },
  { id: 2, athleteId: 2, date: "2024-01-11", duration: 45, score: 7 },
];

let athletes: Athlete[] = seedAthletes.map((a) => ({ ...a }));
let sessions: Session[] = seedSessions.map((s) => ({ ...s }));
let nextAthleteId = 3;
let nextSessionId = 3;

export function __reset() {
  athletes = seedAthletes.map((a) => ({ ...a }));
  sessions = seedSessions.map((s) => ({ ...s }));
  nextAthleteId = 3;
  nextSessionId = 3;
}

export function getAthletes(): Athlete[] {
  return athletes;
}

export function addAthlete(name: string, sport: string, position: string): Athlete {
  const a: Athlete = { id: nextAthleteId++, name, sport, position };
  athletes.push(a);
  return a;
}

export function removeAthlete(id: number): boolean {
  const idx = athletes.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  athletes.splice(idx, 1);
  sessions = sessions.filter((s) => s.athleteId !== id);
  return true;
}

export function getSessions(): Session[] {
  return sessions;
}

export function addSession(
  athleteId: number,
  date: string,
  duration: number,
  score: number
): Session | null {
  if (duration <= 0 || score < 1 || score > 10) return null;
  const s: Session = { id: nextSessionId++, athleteId, date, duration, score };
  sessions.push(s);
  return s;
}
