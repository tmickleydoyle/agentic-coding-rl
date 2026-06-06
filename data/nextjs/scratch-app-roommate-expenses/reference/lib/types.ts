export interface Roommate {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  splitWith: string[];
  date: string;
  category: string;
}

export interface Settlement {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  date: string;
}
