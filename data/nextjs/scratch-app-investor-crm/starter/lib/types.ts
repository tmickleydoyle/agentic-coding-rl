export type InvestorStage = "Lead" | "Contacted" | "Meeting" | "Term Sheet" | "Closed" | "Pass";
export type InteractionType = "Call" | "Email" | "Meeting";

export interface Investor {
  id: string;
  name: string;
  firm: string;
  email: string;
  stage: InvestorStage;
}

export interface Interaction {
  id: string;
  investorId: string;
  type: InteractionType;
  notes: string;
  date: string;
}
