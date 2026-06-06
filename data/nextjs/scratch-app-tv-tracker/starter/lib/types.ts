export type ShowStatus = "want-to-watch" | "watching" | "completed" | "dropped";

export interface Show {
  id: string;
  title: string;
  network: string;
  genre: string;
  totalSeasons: number;
  status: ShowStatus;
  currentSeason: number;
  currentEpisode: number;
  favorite: boolean;
  addedAt: string;
}

export type Route = "/" | "/watchlist" | "/progress" | "/favorites";
