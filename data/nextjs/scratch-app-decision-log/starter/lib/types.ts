export type DecisionStatus = "pending" | "decided" | "revisited";

export interface Decision {
  id: string;
  title: string;
  context: string;
  options: string;
  outcome: string;
  status: DecisionStatus;
  tags: string[];
  decisionDate: string;
  createdAt: string;
}

export type Route = "log" | "archive" | "filter" | "stats";
