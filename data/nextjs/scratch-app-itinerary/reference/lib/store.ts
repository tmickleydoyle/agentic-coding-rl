import type { Activity } from "./types";

const seed: Activity[] = [
  { id: "1", day: 1, time: "09:00", title: "Check in Hotel", location: "Tokyo", category: "Accommodation", duration: 60, notes: "", cost: 0 },
  { id: "2", day: 1, time: "14:00", title: "Senso-ji Temple", location: "Tokyo", category: "Sightseeing", duration: 120, notes: "Famous temple", cost: 0 },
  { id: "3", day: 2, time: "08:00", title: "Breakfast at Tsukiji", location: "Tokyo", category: "Food", duration: 90, notes: "Fresh sushi", cost: 25 },
  { id: "4", day: 2, time: "13:00", title: "Shinkansen to Kyoto", location: "Tokyo", category: "Transport", duration: 140, notes: "", cost: 80 },
  { id: "5", day: 3, time: "10:00", title: "Fushimi Inari", location: "Kyoto", category: "Sightseeing", duration: 180, notes: "Thousands of torii gates", cost: 0 },
];

let activities: Activity[] = seed.map((a) => ({ ...a }));
let nextId = 6;

export function getActivities(): Activity[] {
  return activities;
}

export function addActivity(data: Omit<Activity, "id">): Activity {
  const activity: Activity = { ...data, id: String(nextId++) };
  activities.push(activity);
  return activity;
}

export function __reset(): void {
  activities = seed.map((a) => ({ ...a }));
  nextId = 6;
}
