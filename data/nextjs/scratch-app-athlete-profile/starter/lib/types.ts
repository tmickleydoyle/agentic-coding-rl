export interface AthleteInfo {
  name: string;
  sport: string;
  dateOfBirth: string;
  bio: string;
}

export interface Metric {
  id: string;
  date: string;
  weight: number;
  height: number;
  vo2max: number;
}

export interface AthleteEvent {
  id: string;
  name: string;
  date: string;
  result: string;
  place: number;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export type Route = "profile" | "metrics" | "events" | "achievements";
