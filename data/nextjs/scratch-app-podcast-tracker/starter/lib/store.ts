import type { Podcast, Episode } from "./types";
export function getPodcasts(): Podcast[] { return []; }
export function addPodcast(_data: Omit<Podcast, "id" | "addedAt" | "episodes">): Podcast { throw new Error("Not implemented"); }
export function removePodcast(_id: string): boolean { return false; }
export function markEpisode(_episodeId: string, _played: boolean): Episode | null { return null; }
export function addEpisode(_podcastId: string, _data: Omit<Episode, "id" | "podcastId" | "played" | "playedAt">): Episode | null { return null; }
export function __reset(): void {}
