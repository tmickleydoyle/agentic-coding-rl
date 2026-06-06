export type PolicyType = "auto" | "home" | "life" | "health" | "other";
export type ClaimStatus = "open" | "resolved" | "denied";

export interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  provider: string;
  policyNumber: string;
  premium: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Claim {
  id: string;
  policyId: string;
  description: string;
  amount: number;
  date: string;
  status: ClaimStatus;
}

export interface Document {
  id: string;
  policyId: string;
  name: string;
  url: string;
  type: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  role: string;
}
