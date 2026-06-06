export type ActivityCategory = "Food" | "Sightseeing" | "Transport" | "Accommodation" | "Entertainment";

export interface Activity {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  category: ActivityCategory;
  duration: number;
  notes: string;
  cost: number;
}
