import { Athlete, CoachSession, Drill } from "./types";

export function __reset(): void {}
export function getAthletes(): Athlete[] { return []; }
export function getSessions(): CoachSession[] { return []; }
export function addAthlete(_name: string, _sport: string, _level: Athlete["level"]): Athlete | null { return null; }
export function deleteAthlete(_id: string): void {}
export function addSession(_athleteId: string, _date: string, _duration: number, _focus: string): CoachSession | null { return null; }
export function addDrill(_sessionId: string, _name: string, _reps: number, _notes: string): Drill | null { return null; }
