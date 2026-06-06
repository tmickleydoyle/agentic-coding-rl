export type EventCategory = "Festival" | "Workshop" | "Sport" | "Community";

export interface LocalEvent {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  organizer: string;
  capacity: number;
  registered: number;
}

export interface Registration {
  id: string;
  eventId: string;
  attendee: string;
  email: string;
  registeredAt: string;
}
