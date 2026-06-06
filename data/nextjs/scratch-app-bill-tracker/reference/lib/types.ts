export type BillCategory = "housing" | "utilities" | "health" | "entertainment" | "insurance" | "other";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: BillCategory;
  isActive: boolean;
}

export type Route = "dashboard" | "bills" | "calendar" | "settings";

export interface AppState {
  route: Route;
  bills: Bill[];
}
