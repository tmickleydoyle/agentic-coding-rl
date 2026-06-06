import type { AuditEvent, AuditAction } from "./types";

const seed: AuditEvent[] = [
  { id: "1", actor: "alice@example.com", action: "CREATE", resource: "Document #101", timestamp: "2024-01-15T09:00:00Z", details: "Created new contract" },
  { id: "2", actor: "bob@example.com", action: "UPDATE", resource: "Document #101", timestamp: "2024-01-15T10:30:00Z", details: "Updated contract terms" },
  { id: "3", actor: "alice@example.com", action: "VIEW", resource: "Report #55", timestamp: "2024-01-16T14:00:00Z", details: "Viewed quarterly report" },
  { id: "4", actor: "carol@example.com", action: "DELETE", resource: "Draft #7", timestamp: "2024-01-17T11:00:00Z", details: "Deleted stale draft" },
];

let events: AuditEvent[] = seed.map((e) => ({ ...e }));
let nextId = 5;

export function getEvents(): AuditEvent[] {
  return events.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function getEvent(id: string): AuditEvent | undefined {
  return events.find((e) => e.id === id);
}

export function appendEvent(data: {
  actor: string; action: AuditAction; resource: string; details: string;
}): AuditEvent {
  const ev: AuditEvent = {
    id: String(nextId++),
    timestamp: new Date().toISOString(),
    ...data,
  };
  events.push(ev);
  return ev;
}

export function __reset(): void {
  events = seed.map((e) => ({ ...e }));
  nextId = 5;
}
