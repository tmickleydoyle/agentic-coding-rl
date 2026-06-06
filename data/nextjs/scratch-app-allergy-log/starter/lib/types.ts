export type Severity = "mild" | "moderate" | "severe";
export type AllergyType = "food" | "medication" | "environmental" | "insect" | "other";

export interface Allergy {
  id: string;
  name: string;
  type: AllergyType;
  severity: Severity;
  symptoms: string[];
  notes: string;
  createdAt: number;
}

export interface ReactionLog {
  id: string;
  allergyId: string;
  allergyName: string;
  date: string;
  symptoms: string[];
  severity: Severity;
  treatment: string;
  createdAt: number;
}

export type Route = "home" | "add" | "reactions" | "triggers";

export interface AppState {
  route: Route;
  allergies: Allergy[];
  reactions: ReactionLog[];
}
