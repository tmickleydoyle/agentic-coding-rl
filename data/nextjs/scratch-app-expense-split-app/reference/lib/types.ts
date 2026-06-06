export interface Group {
  id: string;
  name: string;
  members: string[];
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
}

export type Route = 'home' | 'groups' | 'expenses' | 'settle';
