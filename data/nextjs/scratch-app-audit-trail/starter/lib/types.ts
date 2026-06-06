export type AuditAction = "CREATE" | "UPDATE" | "VIEW" | "DELETE" | "OTHER";

export interface AuditEvent {
  id: string;
  actor: string;
  action: AuditAction;
  resource: string;
  timestamp: string;
  details: string;
}

export type Route =
  | { name: "dashboard" }
  | { name: "trail" }
  | { name: "detail"; id: string };
