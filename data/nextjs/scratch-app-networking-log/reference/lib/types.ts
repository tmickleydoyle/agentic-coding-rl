export interface NetworkEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  type: "conference" | "meetup" | "workshop" | "other";
}

export interface Connection {
  id: string;
  eventId: string;
  name: string;
  role: string;
  company: string;
  email: string;
}

export interface FollowUp {
  id: string;
  connectionId: string;
  connectionName: string;
  action: string;
  done: boolean;
  createdAt: string;
}

export type Route = "dashboard" | "events" | "connections" | "followups";
