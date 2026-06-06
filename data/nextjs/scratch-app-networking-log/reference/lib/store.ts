import { NetworkEvent, Connection, FollowUp } from "./types";

const seedEvents: NetworkEvent[] = [
  { id: "e1", name: "ReactConf 2024", date: "2024-05-15", location: "Las Vegas", type: "conference" },
  { id: "e2", name: "Local JS Meetup", date: "2024-06-01", location: "San Francisco", type: "meetup" },
];

const seedConnections: Connection[] = [
  { id: "con1", eventId: "e1", name: "Sara Lee", role: "Engineer", company: "TechCorp", email: "sara@tech.com" },
  { id: "con2", eventId: "e1", name: "Mike Tan", role: "PM", company: "StartupXY", email: "mike@xy.com" },
  { id: "con3", eventId: "e2", name: "Jo Park", role: "Designer", company: "DesignCo", email: "jo@design.com" },
];

const seedFollowUps: FollowUp[] = [
  { id: "f1", connectionId: "con1", connectionName: "Sara Lee", action: "Send portfolio", done: false, createdAt: "2024-05-16" },
  { id: "f2", connectionId: "con2", connectionName: "Mike Tan", action: "Schedule coffee", done: true, createdAt: "2024-05-17" },
];

let events: NetworkEvent[] = [...seedEvents];
let connections: Connection[] = [...seedConnections];
let followUps: FollowUp[] = [...seedFollowUps];
let eCounter = 3;
let cCounter = 4;
let fCounter = 3;

export function __reset() {
  events = [...seedEvents];
  connections = [...seedConnections];
  followUps = [...seedFollowUps];
  eCounter = 3;
  cCounter = 4;
  fCounter = 3;
}

export function getEvents(): NetworkEvent[] { return events; }

export function addEvent(data: { name: string; date: string; location: string; type: NetworkEvent["type"] }): NetworkEvent {
  const e: NetworkEvent = { id: `e${eCounter++}`, ...data };
  events.push(e);
  return e;
}

export function deleteEvent(id: string): void {
  events = events.filter((e) => e.id !== id);
  connections = connections.filter((c) => c.eventId !== id);
}

export function getConnections(): Connection[] { return connections; }

export function addConnection(data: { eventId: string; name: string; role: string; company: string; email: string }): Connection {
  const c: Connection = { id: `con${cCounter++}`, ...data };
  connections.push(c);
  return c;
}

export function getFollowUps(): FollowUp[] { return followUps; }

export function toggleFollowUp(id: string): void {
  const f = followUps.find((f) => f.id === id);
  if (f) f.done = !f.done;
}

export function addFollowUp(data: { connectionId: string; connectionName: string; action: string }): FollowUp {
  const f: FollowUp = { id: `f${fCounter++}`, ...data, done: false, createdAt: new Date().toISOString() };
  followUps.push(f);
  return f;
}
