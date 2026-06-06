export interface Conference {
  id: string;
  name: string;
  date: string;
  location: string;
  attended: boolean;
}

export interface Talk {
  id: string;
  conferenceId: string;
  speakerId: string;
  title: string;
  notes: string;
  tags: string[];
  rating: number;
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
  twitter: string;
}

export type Route = "dashboard" | "conferences" | "talks" | "speakers";
