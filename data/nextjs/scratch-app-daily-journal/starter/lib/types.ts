export type Mood = "great" | "good" | "okay" | "bad" | "terrible";

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  mood: Mood;
  tags: string[];
  createdAt: number;
}

export type Route = "home" | "entries" | "new-entry" | "search";

export interface AppState {
  route: Route;
  entries: JournalEntry[];
  selectedEntryId: string | null;
}
