import { Session, Exercise } from "./types";

export function __reset(): void {}

export function getSessions(): Session[] {
  return [];
}

export function addSession(_name: string, _date: string): Session | null {
  return null;
}

export function deleteSession(_id: string): void {}

export function addExercise(
  _sessionId: string,
  _name: string,
  _sets: number,
  _reps: number,
  _weight: number
): Exercise | null {
  return null;
}
