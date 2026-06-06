import type { Movie, WatchStatus } from "./types";

let movies: Movie[] = [
  { id: "1", title: "Inception", director: "Christopher Nolan", genre: "Sci-Fi", year: 2010, runtime: 148, status: "watched", rating: 5, review: "Mind-blowing!", addedAt: "2024-01-01" },
  { id: "2", title: "The Matrix", director: "The Wachowskis", genre: "Action", year: 1999, runtime: 136, status: "want-to-watch", rating: null, review: "", addedAt: "2024-01-10" },
];
let nextId = 3;

export function getMovies(): Movie[] {
  return movies;
}

export function addMovie(data: Omit<Movie, "id" | "addedAt" | "status" | "rating" | "review">): Movie {
  const movie: Movie = { id: String(nextId++), ...data, status: "want-to-watch", rating: null, review: "", addedAt: new Date().toISOString().slice(0, 10) };
  movies.push(movie);
  return movie;
}

export function updateMovie(id: string, patch: Partial<Pick<Movie, "status" | "rating" | "review">>): Movie | null {
  const movie = movies.find((m) => m.id === id);
  if (!movie) return null;
  if (patch.status !== undefined) movie.status = patch.status as WatchStatus;
  if (patch.rating !== undefined) movie.rating = patch.rating;
  if (patch.review !== undefined) movie.review = patch.review;
  return movie;
}

export function removeMovie(id: string): boolean {
  const before = movies.length;
  movies = movies.filter((m) => m.id !== id);
  return movies.length < before;
}

export function __reset(): void {
  movies = [
    { id: "1", title: "Inception", director: "Christopher Nolan", genre: "Sci-Fi", year: 2010, runtime: 148, status: "watched", rating: 5, review: "Mind-blowing!", addedAt: "2024-01-01" },
    { id: "2", title: "The Matrix", director: "The Wachowskis", genre: "Action", year: 1999, runtime: 136, status: "want-to-watch", rating: null, review: "", addedAt: "2024-01-10" },
  ];
  nextId = 3;
}
