import type { AuditEvent, AuditAction } from "./types";

export function getEvents(): AuditEvent[] {
  return [];
}

export function getEvent(_id: string): AuditEvent | undefined {
  return undefined;
}

export function appendEvent(_data: {
  actor: string; action: AuditAction; resource: string; details: string;
}): AuditEvent {
  throw new Error("Not implemented");
}

export function __reset(): void {}
