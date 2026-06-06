import type { SleepEntry, SleepQuality } from "./types";

function computeDuration(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let minutes = (wh * 60 + wm) - (bh * 60 + bm);
  if (minutes < 0) minutes += 24 * 60;
  return Math.round((minutes / 60) * 10) / 10;
}

let entries: SleepEntry[] = [
  { id: "1", date: "2024-01-10", bedtime: "22:30", wakeTime: "06:30", durationHours: 8, quality: 4, notes: "Slept well", createdAt: 1704844800000 },
  { id: "2", date: "2024-01-11", bedtime: "23:45", wakeTime: "06:15", durationHours: 6.5, quality: 3, notes: "Woke up once", createdAt: 1704931200000 },
  { id: "3", date: "2024-01-12", bedtime: "22:00", wakeTime: "07:00", durationHours: 9, quality: 5, notes: "Best sleep in a while", createdAt: 1705017600000 },
];
let nextId = 4;

export function getEntries(): SleepEntry[] { return [...entries]; }

export function addEntry(data: { date: string; bedtime: string; wakeTime: string; quality: SleepQuality; notes: string }): SleepEntry {
  const durationHours = computeDuration(data.bedtime, data.wakeTime);
  const entry: SleepEntry = { id: String(nextId++), ...data, durationHours, createdAt: Date.now() };
  entries.push(entry);
  return entry;
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  entries.splice(idx, 1);
  return true;
}

export function getInsights(): { avgDuration: number; avgQuality: number; bestNight: SleepEntry | null; worstNight: SleepEntry | null } {
  if (entries.length === 0) return { avgDuration: 0, avgQuality: 0, bestNight: null, worstNight: null };
  const avgDuration = Math.round(entries.reduce((a, e) => a + e.durationHours, 0) / entries.length * 10) / 10;
  const avgQuality = Math.round(entries.reduce((a, e) => a + e.quality, 0) / entries.length * 10) / 10;
  const bestNight = entries.reduce((a, b) => (a.quality >= b.quality ? a : b));
  const worstNight = entries.reduce((a, b) => (a.quality <= b.quality ? a : b));
  return { avgDuration, avgQuality, bestNight, worstNight };
}

export function __reset(): void {
  entries = [
    { id: "1", date: "2024-01-10", bedtime: "22:30", wakeTime: "06:30", durationHours: 8, quality: 4, notes: "Slept well", createdAt: 1704844800000 },
    { id: "2", date: "2024-01-11", bedtime: "23:45", wakeTime: "06:15", durationHours: 6.5, quality: 3, notes: "Woke up once", createdAt: 1704931200000 },
    { id: "3", date: "2024-01-12", bedtime: "22:00", wakeTime: "07:00", durationHours: 9, quality: 5, notes: "Best sleep in a while", createdAt: 1705017600000 },
  ];
  nextId = 4;
}
