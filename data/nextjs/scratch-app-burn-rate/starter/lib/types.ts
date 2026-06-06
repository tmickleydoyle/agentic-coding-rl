export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
}
