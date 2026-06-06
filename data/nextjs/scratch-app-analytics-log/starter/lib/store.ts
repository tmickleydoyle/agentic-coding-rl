import { EventLog, Funnel, Segment } from "./types";

export function __reset() {}
export function getEvents(_name?: string): EventLog[] { return []; }
export function addEvent(_data: Omit<EventLog, "id" | "createdAt">): EventLog | { error: string } { return { error: "not implemented" }; }
export function getOverview(): { total: number; uniqueSessions: number; top3: string[] } {
  return { total: 0, uniqueSessions: 0, top3: [] };
}
export function getFunnels(): Funnel[] { return []; }
export function addFunnel(_data: Omit<Funnel, "id" | "createdAt">): Funnel | { error: string } { return { error: "not implemented" }; }
export function getFunnelStats(_id: string): { step: string; count: number }[] | { error: string } { return { error: "not implemented" }; }
export function getSegments(): Segment[] { return []; }
export function addSegment(_data: Omit<Segment, "id" | "createdAt">): Segment {
  return { id: "", name: "", eventName: "", minOccurrences: 0, createdAt: 0 };
}
export function getSegmentCount(_id: string): number | { error: string } { return { error: "not implemented" }; }
