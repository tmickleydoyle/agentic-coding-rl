import type { MoodLog, MoodLevel } from "./types";

let logs: MoodLog[] = [
  { id: "1", date: "2024-01-10", level: 4, note: "Good day overall", activities: ["exercise", "reading"], createdAt: 1704844800000 },
  { id: "2", date: "2024-01-11", level: 2, note: "Felt tired and stressed", activities: ["work"], createdAt: 1704931200000 },
  { id: "3", date: "2024-01-12", level: 5, note: "Amazing! Had fun with friends", activities: ["social", "exercise"], createdAt: 1705017600000 },
];

let nextId = 4;

export function getLogs(): MoodLog[] {
  return [...logs];
}

export function addLog(data: { date: string; level: MoodLevel; note: string; activities: string[] }): MoodLog {
  const log: MoodLog = { id: String(nextId++), ...data, createdAt: Date.now() };
  logs.push(log);
  return log;
}

export function deleteLog(id: string): boolean {
  const idx = logs.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  logs.splice(idx, 1);
  return true;
}

export function getAverageMood(): number {
  if (logs.length === 0) return 0;
  const sum = logs.reduce((acc, l) => acc + l.level, 0);
  return Math.round((sum / logs.length) * 10) / 10;
}

export function getMoodDistribution(): Record<MoodLevel, number> {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  logs.forEach((l) => { dist[l.level] = (dist[l.level] || 0) + 1; });
  return dist as Record<MoodLevel, number>;
}

export function __reset(): void {
  logs = [
    { id: "1", date: "2024-01-10", level: 4, note: "Good day overall", activities: ["exercise", "reading"], createdAt: 1704844800000 },
    { id: "2", date: "2024-01-11", level: 2, note: "Felt tired and stressed", activities: ["work"], createdAt: 1704931200000 },
    { id: "3", date: "2024-01-12", level: 5, note: "Amazing! Had fun with friends", activities: ["social", "exercise"], createdAt: 1705017600000 },
  ];
  nextId = 4;
}
