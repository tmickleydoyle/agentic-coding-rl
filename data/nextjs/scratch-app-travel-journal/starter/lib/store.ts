import type { JournalEntry } from "./types";

export function getEntries(): JournalEntry[] {
  return [];
}

export function addEntry(_data: Omit<JournalEntry, "id">): JournalEntry {
  return { id: "", title: "", country: "", city: "", date: "", mood: "happy", body: "", rating: 0 };
}

export function __reset(): void {}
