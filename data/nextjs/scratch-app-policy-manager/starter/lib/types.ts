export type Department = "IT" | "HR" | "Legal" | "Finance" | "Operations" | "Other";
export type PolicyStatus = "Draft" | "Active" | "Archived";

export interface Policy {
  id: string;
  title: string;
  department: Department;
  version: string;
  status: PolicyStatus;
  owner: string;
  reviewDate: string;
  summary: string;
}

export type Route =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
