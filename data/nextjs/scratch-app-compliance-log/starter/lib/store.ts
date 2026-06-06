import type { ComplianceLog, Regulation, Severity, LogStatus } from "./types";

export function getLogs(): ComplianceLog[] {
  return [];
}

export function getLog(_id: string): ComplianceLog | undefined {
  return undefined;
}

export function addLog(_data: {
  title: string; regulation: Regulation; severity: Severity;
  status: LogStatus; date: string; notes: string;
}): ComplianceLog {
  throw new Error("Not implemented");
}

export function __reset(): void {}
