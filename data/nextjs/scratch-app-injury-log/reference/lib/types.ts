export type InjuryType = "strain" | "sprain" | "fracture" | "bruise";
export type Severity = "mild" | "moderate" | "severe";
export type TreatmentType = "ice" | "physio" | "rest" | "medication";

export interface Treatment {
  id: string;
  type: TreatmentType;
  date: string;
  duration: number;
}

export interface RecoveryNote {
  id: string;
  text: string;
  date: string;
}

export interface Injury {
  id: string;
  bodyPart: string;
  type: InjuryType;
  severity: Severity;
  date: string;
  treatments: Treatment[];
  notes: RecoveryNote[];
}

export type Route = "injuries" | "treatment" | "timeline" | "notes";
