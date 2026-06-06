import type { Game } from "./types";
export function getGames(): Game[] { return []; }
export function addGame(_data: Omit<Game, "id" | "addedAt" | "status" | "hoursPlayed">): Game { throw new Error("Not implemented"); }
export function updateGame(_id: string, _patch: Partial<Pick<Game, "status" | "hoursPlayed">>): Game | null { return null; }
export function removeGame(_id: string): boolean { return false; }
export function __reset(): void {}
