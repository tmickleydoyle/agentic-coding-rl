import type { JournalEntry, Mood } from "./types";

export function getEntries(): JournalEntry[] {
  return [];
}

export function getEntryById(_id: string): JournalEntry | undefined {
  return undefined;
}

export function addEntry(_data: {
  date: string;
  title: string;
  body: string;
  mood: Mood;
  tags: string[];
}): JournalEntry {
  throw new Error("Not implemented");
}

export function deleteEntry(_id: string): boolean {
  return false;
}

export function searchEntries(_query: string): JournalEntry[] {
  return [];
}

export function __reset(): void {}
