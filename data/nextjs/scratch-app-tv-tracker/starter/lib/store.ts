import type { Show } from "./types";
export function getShows(): Show[] { return []; }
export function addShow(_data: Omit<Show, "id" | "addedAt" | "status" | "currentSeason" | "currentEpisode" | "favorite">): Show { throw new Error("Not implemented"); }
export function updateShow(_id: string, _patch: Partial<Pick<Show, "status" | "currentSeason" | "currentEpisode" | "favorite">>): Show | null { return null; }
export function removeShow(_id: string): boolean { return false; }
export function __reset(): void {}
