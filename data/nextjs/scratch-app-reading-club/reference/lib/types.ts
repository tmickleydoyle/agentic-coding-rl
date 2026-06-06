export type ReadingStatus = "want-to-read" | "reading" | "read";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: ReadingStatus;
  addedAt: string;
}

export type Route = "/" | "/reading-list" | "/stats" | "/discover";

export interface AppState {
  route: Route;
  books: Book[];
}
