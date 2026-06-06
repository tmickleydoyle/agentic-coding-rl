export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  budgetLimit: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export type Route = 'home' | 'transactions' | 'categories' | 'summary';
