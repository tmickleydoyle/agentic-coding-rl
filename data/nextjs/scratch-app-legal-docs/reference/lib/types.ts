export type Category = "Contract" | "Policy" | "NDA" | "Other";
export type Status = "Draft" | "Active" | "Archived";

export interface LegalDocument {
  id: string;
  title: string;
  category: Category;
  status: Status;
  createdAt: string;
}

export type Route =
  | { name: "home" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
