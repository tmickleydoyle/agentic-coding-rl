import type { Policy, Department, PolicyStatus } from "./types";

const seed: Policy[] = [
  { id: "1", title: "Acceptable Use Policy", department: "IT", version: "2.1", status: "Active", owner: "IT Director", reviewDate: "2024-12-01", summary: "Guidelines for acceptable use of company IT resources" },
  { id: "2", title: "Remote Work Policy", department: "HR", version: "1.0", status: "Draft", owner: "HR Manager", reviewDate: "2024-06-15", summary: "Rules and guidelines for remote work arrangements" },
  { id: "3", title: "Data Retention Policy", department: "Legal", version: "3.0", status: "Active", owner: "General Counsel", reviewDate: "2024-09-30", summary: "Requirements for data retention and disposal" },
];

let policies: Policy[] = seed.map((p) => ({ ...p }));
let nextId = 4;

export function getPolicies(): Policy[] {
  return policies;
}

export function getPolicy(id: string): Policy | undefined {
  return policies.find((p) => p.id === id);
}

export function addPolicy(data: {
  title: string; department: Department; version: string;
  status: PolicyStatus; owner: string; reviewDate: string; summary: string;
}): Policy {
  const p: Policy = { id: String(nextId++), ...data };
  policies.push(p);
  return p;
}

export function __reset(): void {
  policies = seed.map((p) => ({ ...p }));
  nextId = 4;
}
