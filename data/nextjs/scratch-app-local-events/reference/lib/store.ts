import type { LocalEvent, Registration, EventCategory } from "./types";

const seedEvents: LocalEvent[] = [
  { id: "ev1", title: "Summer Festival", date: "2024-08-10", category: "Festival", organizer: "City Parks", capacity: 200, registered: 45 },
  { id: "ev2", title: "React Workshop", date: "2024-08-15", category: "Workshop", organizer: "TechHub", capacity: 30, registered: 28 },
  { id: "ev3", title: "5K Run", date: "2024-08-20", category: "Sport", organizer: "Running Club", capacity: 100, registered: 60 },
];

const seedRegistrations: Registration[] = [
  { id: "r1", eventId: "ev1", attendee: "Alice", email: "alice@example.com", registeredAt: "2024-07-01" },
  { id: "r2", eventId: "ev2", attendee: "Bob", email: "bob@example.com", registeredAt: "2024-07-02" },
];

let events: LocalEvent[] = seedEvents.map((e) => ({ ...e }));
let registrations: Registration[] = seedRegistrations.map((r) => ({ ...r }));
let nextEId = 4;
let nextRId = 3;

export function getEvents(): LocalEvent[] { return events; }
export function getRegistrations(): Registration[] { return registrations; }

export function createEvent(title: string, date: string, category: EventCategory, organizer: string, capacity: number): LocalEvent {
  const ev: LocalEvent = { id: `ev${nextEId++}`, title, date, category, organizer, capacity, registered: 0 };
  events = [...events, ev];
  return ev;
}

export function registerForEvent(eventId: string, attendee: string, email: string): Registration | null {
  const ev = events.find((e) => e.id === eventId);
  if (!ev || ev.registered >= ev.capacity) return null;
  events = events.map((e) => e.id === eventId ? { ...e, registered: e.registered + 1 } : e);
  const reg: Registration = { id: `r${nextRId++}`, eventId, attendee, email, registeredAt: new Date().toISOString().slice(0, 10) };
  registrations = [...registrations, reg];
  return reg;
}

export function __reset(): void {
  events = seedEvents.map((e) => ({ ...e }));
  registrations = seedRegistrations.map((r) => ({ ...r }));
  nextEId = 4;
  nextRId = 3;
}
