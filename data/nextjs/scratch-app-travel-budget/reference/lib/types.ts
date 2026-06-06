export type ExpenseCategory = "Food" | "Transport" | "Accommodation" | "Activities" | "Shopping" | "Other";

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  originalAmount: number;
}

export interface BudgetConfig {
  totalBudget: number;
  tripName: string;
  currency: string;
}
