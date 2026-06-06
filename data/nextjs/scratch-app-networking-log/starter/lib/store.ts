import { NetworkEvent, Connection, FollowUp } from "./types";

export function __reset(): void {}
export function getEvents(): NetworkEvent[] { return []; }
export function addEvent(_data: { name: string; date: string; location: string; type: NetworkEvent["type"] }): NetworkEvent {
  return { id: "", name: "", date: "", location: "", type: "other" };
}
export function deleteEvent(_id: string): void {}
export function getConnections(): Connection[] { return []; }
export function addConnection(_data: { eventId: string; name: string; role: string; company: string; email: string }): Connection {
  return { id: "", eventId: "", name: "", role: "", company: "", email: "" };
}
export function getFollowUps(): FollowUp[] { return []; }
export function toggleFollowUp(_id: string): void {}
export function addFollowUp(_data: { connectionId: string; connectionName: string; action: string }): FollowUp {
  return { id: "", connectionId: "", connectionName: "", action: "", done: false, createdAt: "" };
}
