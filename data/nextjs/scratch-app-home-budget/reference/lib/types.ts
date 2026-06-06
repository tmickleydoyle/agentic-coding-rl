export type Category = "housing" | "food" | "transport" | "utilities" | "entertainment" | "other";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export type Route = "home" | "expenses" | "income" | "reports";

export interface AppState {
  route: Route;
  expenses: Expense[];
  incomes: Income[];
}
