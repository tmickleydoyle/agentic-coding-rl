export type Mood = "happy" | "neutral" | "sad";

export interface JournalEntry {
  id: string;
  title: string;
  country: string;
  city: string;
  date: string;
  mood: Mood;
  body: string;
  rating: number;
}
