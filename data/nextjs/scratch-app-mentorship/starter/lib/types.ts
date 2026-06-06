export interface Mentor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  active: boolean;
}

export interface Session {
  id: string;
  mentorId: string;
  date: string;
  duration: number;
  notes: string;
  upcoming: boolean;
}

export interface Goal {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

export type Route = "dashboard" | "mentors" | "sessions" | "goals";
