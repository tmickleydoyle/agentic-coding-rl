import type { JournalEntry } from "./types";

const seed: JournalEntry[] = [
  { id: "1", title: "Arrival in Tokyo", country: "Japan", city: "Tokyo", date: "2024-03-15", mood: "happy", body: "Amazing first day!", rating: 5 },
  { id: "2", title: "Lost in Kyoto", country: "Japan", city: "Kyoto", date: "2024-03-18", mood: "happy", body: "Found hidden temples.", rating: 4 },
  { id: "3", title: "Rainy Rome", country: "Italy", city: "Rome", date: "2024-05-02", mood: "neutral", body: "Saw the Colosseum despite rain.", rating: 3 },
];

let entries: JournalEntry[] = seed.map((e) => ({ ...e }));
let nextId = 4;

export function getEntries(): JournalEntry[] {
  return entries;
}

export function addEntry(data: Omit<JournalEntry, "id">): JournalEntry {
  const entry: JournalEntry = { ...data, id: String(nextId++) };
  entries.push(entry);
  return entry;
}

export function __reset(): void {
  entries = seed.map((e) => ({ ...e }));
  nextId = 4;
}
