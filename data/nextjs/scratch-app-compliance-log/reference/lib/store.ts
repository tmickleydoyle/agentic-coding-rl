import type { ComplianceLog, Regulation, Severity, LogStatus } from "./types";

const seed: ComplianceLog[] = [
  { id: "1", title: "GDPR Data Audit", regulation: "GDPR", severity: "High", status: "Resolved", date: "2024-01-20", notes: "Annual audit completed" },
  { id: "2", title: "SOX Financial Control Review", regulation: "SOX", severity: "Critical", status: "Open", date: "2024-02-15", notes: "Under review" },
  { id: "3", title: "HIPAA Security Assessment", regulation: "HIPAA", severity: "Medium", status: "Open", date: "2024-03-05", notes: "Initial assessment" },
];

let logs: ComplianceLog[] = seed.map((l) => ({ ...l }));
let nextId = 4;

export function getLogs(): ComplianceLog[] {
  return logs;
}

export function getLog(id: string): ComplianceLog | undefined {
  return logs.find((l) => l.id === id);
}

export function addLog(data: {
  title: string; regulation: Regulation; severity: Severity;
  status: LogStatus; date: string; notes: string;
}): ComplianceLog {
  const entry: ComplianceLog = { id: String(nextId++), ...data };
  logs.push(entry);
  return entry;
}

export function __reset(): void {
  logs = seed.map((l) => ({ ...l }));
  nextId = 4;
}
