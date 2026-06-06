import type { BPReading } from "./types";

export function getReadings(): BPReading[] { return []; }
export function addReading(_data: { date: string; time: string; systolic: number; diastolic: number; pulse: number; note: string }): BPReading { throw new Error("Not implemented"); }
export function deleteReading(_id: string): boolean { return false; }
export function getAverages(): { systolic: number; diastolic: number; pulse: number } { return { systolic: 0, diastolic: 0, pulse: 0 }; }
export function __reset(): void {}
