export interface Speaker {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  following: boolean;
}

export interface TalkRecord {
  id: string;
  speakerId: string;
  title: string;
  eventName: string;
  watchedDate: string;
  watched: boolean;
  rating: number;
  notes: string;
}

export interface SpeakingEvent {
  id: string;
  speakerId: string;
  eventName: string;
  date: string;
  location: string;
  rsvped: boolean;
}

export type Route = "dashboard" | "speakers" | "talks" | "events";
