import type { BPReading, BPCategory } from "./types";

function categorize(systolic: number, diastolic: number): BPCategory {
  if (systolic >= 180 || diastolic >= 120) return "crisis";
  if (systolic >= 140 || diastolic >= 90) return "high-2";
  if (systolic >= 130 || diastolic >= 80) return "high-1";
  if (systolic >= 120 && diastolic < 80) return "elevated";
  return "normal";
}

let readings: BPReading[] = [
  { id: "1", date: "2024-01-10", time: "08:00", systolic: 118, diastolic: 76, pulse: 68, note: "Morning", category: "normal", createdAt: 1704844800000 },
  { id: "2", date: "2024-01-11", time: "08:15", systolic: 125, diastolic: 79, pulse: 72, note: "Slightly elevated", category: "elevated", createdAt: 1704931200000 },
  { id: "3", date: "2024-01-12", time: "09:00", systolic: 132, diastolic: 84, pulse: 75, note: "High after coffee", category: "high-1", createdAt: 1705017600000 },
];
let nextId = 4;

export function getReadings(): BPReading[] {
  return [...readings];
}

export function addReading(data: { date: string; time: string; systolic: number; diastolic: number; pulse: number; note: string }): BPReading {
  const category = categorize(data.systolic, data.diastolic);
  const reading: BPReading = { id: String(nextId++), ...data, category, createdAt: Date.now() };
  readings.push(reading);
  return reading;
}

export function deleteReading(id: string): boolean {
  const idx = readings.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  readings.splice(idx, 1);
  return true;
}

export function getAverages(): { systolic: number; diastolic: number; pulse: number } {
  if (readings.length === 0) return { systolic: 0, diastolic: 0, pulse: 0 };
  const s = readings.reduce((a, r) => a + r.systolic, 0) / readings.length;
  const d = readings.reduce((a, r) => a + r.diastolic, 0) / readings.length;
  const p = readings.reduce((a, r) => a + r.pulse, 0) / readings.length;
  return {
    systolic: Math.round(s),
    diastolic: Math.round(d),
    pulse: Math.round(p),
  };
}

export function __reset(): void {
  readings = [
    { id: "1", date: "2024-01-10", time: "08:00", systolic: 118, diastolic: 76, pulse: 68, note: "Morning", category: "normal", createdAt: 1704844800000 },
    { id: "2", date: "2024-01-11", time: "08:15", systolic: 125, diastolic: 79, pulse: 72, note: "Slightly elevated", category: "elevated", createdAt: 1704931200000 },
    { id: "3", date: "2024-01-12", time: "09:00", systolic: 132, diastolic: 84, pulse: 75, note: "High after coffee", category: "high-1", createdAt: 1705017600000 },
  ];
  nextId = 4;
}
