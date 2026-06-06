import type { Show, ShowStatus } from "./types";

let shows: Show[] = [
  { id: "1", title: "Breaking Bad", network: "AMC", genre: "Drama", totalSeasons: 5, status: "completed", currentSeason: 5, currentEpisode: 16, favorite: true, addedAt: "2024-01-01" },
  { id: "2", title: "Stranger Things", network: "Netflix", genre: "Sci-Fi", totalSeasons: 4, status: "watching", currentSeason: 3, currentEpisode: 5, favorite: false, addedAt: "2024-01-10" },
];
let nextId = 3;

export function getShows(): Show[] { return shows; }
export function addShow(data: Omit<Show, "id" | "addedAt" | "status" | "currentSeason" | "currentEpisode" | "favorite">): Show {
  const show: Show = { id: String(nextId++), ...data, status: "want-to-watch", currentSeason: 1, currentEpisode: 1, favorite: false, addedAt: new Date().toISOString().slice(0, 10) };
  shows.push(show);
  return show;
}
export function updateShow(id: string, patch: Partial<Pick<Show, "status" | "currentSeason" | "currentEpisode" | "favorite">>): Show | null {
  const show = shows.find((s) => s.id === id);
  if (!show) return null;
  if (patch.status !== undefined) show.status = patch.status as ShowStatus;
  if (patch.currentSeason !== undefined) show.currentSeason = patch.currentSeason;
  if (patch.currentEpisode !== undefined) show.currentEpisode = patch.currentEpisode;
  if (patch.favorite !== undefined) show.favorite = patch.favorite;
  return show;
}
export function removeShow(id: string): boolean {
  const before = shows.length;
  shows = shows.filter((s) => s.id !== id);
  return shows.length < before;
}
export function __reset(): void {
  shows = [
    { id: "1", title: "Breaking Bad", network: "AMC", genre: "Drama", totalSeasons: 5, status: "completed", currentSeason: 5, currentEpisode: 16, favorite: true, addedAt: "2024-01-01" },
    { id: "2", title: "Stranger Things", network: "Netflix", genre: "Sci-Fi", totalSeasons: 4, status: "watching", currentSeason: 3, currentEpisode: 5, favorite: false, addedAt: "2024-01-10" },
  ];
  nextId = 3;
}
