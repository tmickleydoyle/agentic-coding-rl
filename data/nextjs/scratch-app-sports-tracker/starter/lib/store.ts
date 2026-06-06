import { Athlete, Session } from "./types";

export function __reset(): void {}

export function getAthletes(): Athlete[] {
  return [];
}

export function addAthlete(_name: string, _sport: string, _position: string): Athlete {
  return { id: 0, name: "", sport: "", position: "" };
}

export function removeAthlete(_id: number): boolean {
  return false;
}

export function getSessions(): Session[] {
  return [];
}

export function addSession(
  _athleteId: number,
  _date: string,
  _duration: number,
  _score: number
): Session | null {
  return null;
}
