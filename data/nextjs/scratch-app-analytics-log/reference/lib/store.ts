import { EventLog, Funnel, Segment } from "./types";

const seedEvents: EventLog[] = [
  { id: "ev1", name: "page_view", sessionId: "s1", properties: {}, timestamp: "2030-06-01T10:00", createdAt: 1000 },
  { id: "ev2", name: "page_view", sessionId: "s2", properties: {}, timestamp: "2030-06-01T10:01", createdAt: 1001 },
  { id: "ev3", name: "page_view", sessionId: "s3", properties: {}, timestamp: "2030-06-01T10:02", createdAt: 1002 },
  { id: "ev4", name: "page_view", sessionId: "s4", properties: {}, timestamp: "2030-06-01T10:03", createdAt: 1003 },
  { id: "ev5", name: "signup", sessionId: "s1", properties: {}, timestamp: "2030-06-01T10:05", createdAt: 1004 },
  { id: "ev6", name: "signup", sessionId: "s2", properties: {}, timestamp: "2030-06-01T10:06", createdAt: 1005 },
  { id: "ev7", name: "purchase", sessionId: "s1", properties: {}, timestamp: "2030-06-01T10:10", createdAt: 1006 },
  { id: "ev8", name: "page_view", sessionId: "s5", properties: {}, timestamp: "2030-06-02T09:00", createdAt: 2000 },
  { id: "ev9", name: "page_view", sessionId: "s6", properties: {}, timestamp: "2030-06-02T09:01", createdAt: 2001 },
  { id: "ev10", name: "page_view", sessionId: "s7", properties: {}, timestamp: "2030-06-02T09:02", createdAt: 2002 },
];
const seedFunnels: Funnel[] = [
  { id: "f1", name: "Signup Flow", steps: ["page_view", "signup", "purchase"], createdAt: 1000 },
];
const seedSegments: Segment[] = [
  { id: "seg1", name: "Buyers", eventName: "purchase", minOccurrences: 1, createdAt: 1000 },
];

let events: EventLog[] = seedEvents.map((e) => ({ ...e, properties: { ...e.properties } }));
let funnels: Funnel[] = seedFunnels.map((f) => ({ ...f, steps: [...f.steps] }));
let segments: Segment[] = seedSegments.map((s) => ({ ...s }));

export function __reset() {
  events = seedEvents.map((e) => ({ ...e, properties: { ...e.properties } }));
  funnels = seedFunnels.map((f) => ({ ...f, steps: [...f.steps] }));
  segments = seedSegments.map((s) => ({ ...s }));
}

export function getEvents(name?: string): EventLog[] {
  const list = events.map((e) => ({ ...e, properties: { ...e.properties } }));
  if (name) return list.filter((e) => e.name.includes(name));
  return list;
}

export function addEvent(data: Omit<EventLog, "id" | "createdAt">): EventLog | { error: string } {
  if (!data.name.trim()) return { error: "Event name required" };
  if (!data.sessionId.trim()) return { error: "sessionId required" };
  const ev: EventLog = { id: `ev${Date.now()}`, createdAt: Date.now(), ...data, properties: { ...data.properties } };
  events.push(ev);
  return { ...ev, properties: { ...ev.properties } };
}

export function getOverview() {
  const total = events.length;
  const uniqueSessions = new Set<string>();
  events.forEach((e) => uniqueSessions.add(e.sessionId));
  const counts: Record<string, number> = {};
  events.forEach((e) => { counts[e.name] = (counts[e.name] || 0) + 1; });
  const top3 = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 3);
  return { total, uniqueSessions: uniqueSessions.size, top3 };
}

export function getFunnels(): Funnel[] { return funnels.map((f) => ({ ...f, steps: [...f.steps] })); }

export function addFunnel(data: Omit<Funnel, "id" | "createdAt">): Funnel | { error: string } {
  if (!data.name.trim()) return { error: "Name required" };
  if (!data.steps || data.steps.length < 2) return { error: "At least 2 steps required" };
  const f: Funnel = { id: `f${Date.now()}`, createdAt: Date.now(), ...data, steps: [...data.steps] };
  funnels.push(f);
  return { ...f, steps: [...f.steps] };
}

export function getFunnelStats(funnelId: string): { step: string; count: number }[] | { error: string } {
  const funnel = funnels.find((f) => f.id === funnelId);
  if (!funnel) return { error: "Not found" };
  const result: { step: string; count: number }[] = [];
  funnel.steps.forEach((step) => {
    const sessions = new Set<string>();
    events.forEach((e) => { if (e.name === step) sessions.add(e.sessionId); });
    result.push({ step, count: sessions.size });
  });
  return result;
}

export function getSegments(): Segment[] { return segments.map((s) => ({ ...s })); }

export function addSegment(data: Omit<Segment, "id" | "createdAt">): Segment {
  const seg: Segment = { id: `seg${Date.now()}`, createdAt: Date.now(), ...data };
  segments.push(seg);
  return { ...seg };
}

export function getSegmentCount(segmentId: string): number | { error: string } {
  const seg = segments.find((s) => s.id === segmentId);
  if (!seg) return { error: "Not found" };
  const sessionCounts: Record<string, number> = {};
  events.forEach((e) => {
    if (e.name === seg.eventName) {
      sessionCounts[e.sessionId] = (sessionCounts[e.sessionId] || 0) + 1;
    }
  });
  return Object.values(sessionCounts).filter((c) => c >= seg.minOccurrences).length;
}
