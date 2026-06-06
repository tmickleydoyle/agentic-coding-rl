export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type Route = 'home' | 'expenses' | 'categories' | 'summary';
