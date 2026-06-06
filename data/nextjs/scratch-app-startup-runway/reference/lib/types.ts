export type Category = "Engineering" | "Marketing" | "Operations" | "Sales";

export interface Expense {
  id: string;
  name: string;
  category: Category;
  amount: number;
}

export interface Settings {
  cashBalance: number;
  targetRunway: number;
}

export interface AppState {
  expenses: Expense[];
  settings: Settings;
  route: string;
}
