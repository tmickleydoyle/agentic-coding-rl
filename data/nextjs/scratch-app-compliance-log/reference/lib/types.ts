export type Regulation = "GDPR" | "SOX" | "HIPAA" | "PCI" | "Other";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type LogStatus = "Open" | "Resolved";

export interface ComplianceLog {
  id: string;
  title: string;
  regulation: Regulation;
  severity: Severity;
  status: LogStatus;
  date: string;
  notes: string;
}

export type Route =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
