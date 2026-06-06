import { AthleteInfo, Metric, AthleteEvent, Achievement } from "./types";

let athleteInfo: AthleteInfo = { name: "Jordan Smith", sport: "Triathlon", dateOfBirth: "1995-08-20", bio: "Competitive triathlete since 2015" };

const SEED_METRICS: Metric[] = [
  { id: "m1", date: "2024-01-10", weight: 72.5, height: 178, vo2max: 58 },
  { id: "m2", date: "2024-04-10", weight: 71.0, height: 178, vo2max: 61 },
];

const SEED_EVENTS: AthleteEvent[] = [
  { id: "e1", name: "City Triathlon", date: "2024-06-15", result: "Finished strong", place: 12 },
  { id: "e2", name: "Sprint Duathlon", date: "2024-08-01", result: "Personal best", place: 3 },
];

const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: "ac1", title: "Age Group Podium", date: "2024-08-01", description: "3rd in 25-29 age group" },
];

let metrics: Metric[] = SEED_METRICS.map((m) => ({ ...m }));
let events: AthleteEvent[] = SEED_EVENTS.map((e) => ({ ...e }));
let achievements: Achievement[] = SEED_ACHIEVEMENTS.map((a) => ({ ...a }));
let mCounter = 3;
let eCounter = 3;
let acCounter = 2;

export function __reset() {
  athleteInfo = { name: "Jordan Smith", sport: "Triathlon", dateOfBirth: "1995-08-20", bio: "Competitive triathlete since 2015" };
  metrics = SEED_METRICS.map((m) => ({ ...m }));
  events = SEED_EVENTS.map((e) => ({ ...e }));
  achievements = SEED_ACHIEVEMENTS.map((a) => ({ ...a }));
  mCounter = 3;
  eCounter = 3;
  acCounter = 2;
}

export function getAthleteInfo(): AthleteInfo { return { ...athleteInfo }; }
export function saveAthleteInfo(info: AthleteInfo): void {
  if (!info.name.trim()) return;
  athleteInfo = { ...info };
}

export function getMetrics(): Metric[] { return metrics; }
export function addMetric(date: string, weight: number, height: number, vo2max: number): Metric | null {
  if (weight <= 0 || height <= 0) return null;
  const m: Metric = { id: `m${mCounter++}`, date, weight, height, vo2max };
  metrics.push(m);
  return m;
}

export function getEvents(): AthleteEvent[] { return events; }
export function addEvent(name: string, date: string, result: string, place: number): AthleteEvent | null {
  if (place < 1) return null;
  const e: AthleteEvent = { id: `e${eCounter++}`, name, date, result, place };
  events.push(e);
  return e;
}
export function deleteEvent(id: string): void { events = events.filter((e) => e.id !== id); }

export function getAchievements(): Achievement[] { return achievements; }
export function addAchievement(title: string, date: string, description: string): Achievement {
  const a: Achievement = { id: `ac${acCounter++}`, title, date, description };
  achievements.push(a);
  return a;
}
export function deleteAchievement(id: string): void { achievements = achievements.filter((a) => a.id !== id); }
