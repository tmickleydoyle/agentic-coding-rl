import type { Activity } from "./types";

export function getActivities(): Activity[] {
  return [];
}

export function addActivity(_data: Omit<Activity, "id">): Activity {
  return { id: "", day: 0, time: "", title: "", location: "", category: "Sightseeing", duration: 0, notes: "", cost: 0 };
}

export function __reset(): void {}
