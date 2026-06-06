export type WatchStatus = "want-to-watch" | "watching" | "watched";

export interface Movie {
  id: string;
  title: string;
  director: string;
  genre: string;
  year: number;
  runtime: number;
  status: WatchStatus;
  rating: number | null;
  review: string;
  addedAt: string;
}

export type Route = "/" | "/watchlist" | "/reviews" | "/discover";

export interface AppState {
  route: Route;
  movies: Movie[];
}
