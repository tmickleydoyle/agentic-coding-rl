export type DocType = "w2" | "1099" | "1098" | "schedule_c" | "other";
export type DeductionCategory = "business" | "charitable" | "medical" | "education" | "other";

export interface TaxDocument {
  id: string;
  name: string;
  type: DocType;
  year: number;
  amount: number;
}

export interface Deduction {
  id: string;
  description: string;
  amount: number;
  category: DeductionCategory;
}

export interface TaxNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

export type Route = "overview" | "documents" | "deductions" | "notes";

export interface AppState {
  route: Route;
  documents: TaxDocument[];
  deductions: Deduction[];
  taxNotes: TaxNote[];
}
