import type { JournalEntry, Mood } from "./types";

let entries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    title: "A great start",
    body: "Today was wonderful. I went for a morning run and felt energized.",
    mood: "great",
    tags: ["exercise", "morning"],
    createdAt: 1705276800000,
  },
  {
    id: "2",
    date: "2024-01-16",
    title: "Rainy day thoughts",
    body: "It rained all day. I stayed inside and read a book.",
    mood: "okay",
    tags: ["reading", "indoor"],
    createdAt: 1705363200000,
  },
];

let nextId = 3;

export function getEntries(): JournalEntry[] {
  return [...entries];
}

export function getEntryById(id: string): JournalEntry | undefined {
  return entries.find((e) => e.id === id);
}

export function addEntry(data: {
  date: string;
  title: string;
  body: string;
  mood: Mood;
  tags: string[];
}): JournalEntry {
  const entry: JournalEntry = {
    id: String(nextId++),
    ...data,
    createdAt: Date.now(),
  };
  entries.push(entry);
  return entry;
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  entries.splice(idx, 1);
  return true;
}

export function searchEntries(query: string): JournalEntry[] {
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function __reset(): void {
  entries = [
    {
      id: "1",
      date: "2024-01-15",
      title: "A great start",
      body: "Today was wonderful. I went for a morning run and felt energized.",
      mood: "great",
      tags: ["exercise", "morning"],
      createdAt: 1705276800000,
    },
    {
      id: "2",
      date: "2024-01-16",
      title: "Rainy day thoughts",
      body: "It rained all day. I stayed inside and read a book.",
      mood: "okay",
      tags: ["reading", "indoor"],
      createdAt: 1705363200000,
    },
  ];
  nextId = 3;
}
