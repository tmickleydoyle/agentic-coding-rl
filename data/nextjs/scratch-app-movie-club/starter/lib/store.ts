import type { Movie } from "./types";

export function getMovies(): Movie[] { return []; }
export function addMovie(_data: Omit<Movie, "id" | "addedAt" | "status" | "rating" | "review">): Movie { throw new Error("Not implemented"); }
export function updateMovie(_id: string, _patch: Partial<Pick<Movie, "status" | "rating" | "review">>): Movie | null { return null; }
export function removeMovie(_id: string): boolean { return false; }
export function __reset(): void {}
