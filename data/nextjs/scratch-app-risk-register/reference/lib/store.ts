import type { Risk, RiskCategory, RiskStatus } from "./types";

const seed: Risk[] = [
  { id: "1", title: "Data Breach", category: "Security", likelihood: 3, impact: 5, status: "Open", owner: "Security Team", description: "Unauthorized access to sensitive data" },
  { id: "2", title: "Vendor Failure", category: "Operational", likelihood: 2, impact: 4, status: "Mitigated", owner: "Procurement", description: "Key vendor goes out of business" },
  { id: "3", title: "Regulatory Non-Compliance", category: "Legal", likelihood: 2, impact: 5, status: "Open", owner: "Legal Team", description: "Failure to meet regulatory requirements" },
];

let risks: Risk[] = seed.map((r) => ({ ...r }));
let nextId = 4;

export function getRisks(): Risk[] {
  return risks;
}

export function getRisk(id: string): Risk | undefined {
  return risks.find((r) => r.id === id);
}

export function addRisk(data: {
  title: string; category: RiskCategory; likelihood: number;
  impact: number; status: RiskStatus; owner: string; description: string;
}): Risk {
  const risk: Risk = { id: String(nextId++), ...data };
  risks.push(risk);
  return risk;
}

export function __reset(): void {
  risks = seed.map((r) => ({ ...r }));
  nextId = 4;
}
