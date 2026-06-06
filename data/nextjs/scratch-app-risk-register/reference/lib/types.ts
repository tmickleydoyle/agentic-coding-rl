export type RiskCategory = "Security" | "Operational" | "Legal" | "Financial" | "Other";
export type RiskStatus = "Open" | "Mitigated" | "Closed";

export interface Risk {
  id: string;
  title: string;
  category: RiskCategory;
  likelihood: number;
  impact: number;
  status: RiskStatus;
  owner: string;
  description: string;
}

export type Route =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
