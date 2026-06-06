export type SignOffStatus = "Pending" | "In Progress" | "Complete";

export interface SignOffItem {
  id: string;
  title: string;
  signers: string[];
  signed: string[];
  dueDate: string;
  status: SignOffStatus;
}

export type Route =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
