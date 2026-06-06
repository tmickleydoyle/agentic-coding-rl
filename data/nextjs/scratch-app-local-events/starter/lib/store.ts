import type { LocalEvent, Registration, EventCategory } from "./types";

export function getEvents(): LocalEvent[] { return []; }
export function getRegistrations(): Registration[] { return []; }
export function createEvent(_title: string, _date: string, _category: EventCategory, _organizer: string, _capacity: number): LocalEvent {
  return { id: "", title: "", date: "", category: "Community", organizer: "", capacity: 0, registered: 0 };
}
export function registerForEvent(_eventId: string, _attendee: string, _email: string): Registration | null { return null; }
export function __reset(): void {}
