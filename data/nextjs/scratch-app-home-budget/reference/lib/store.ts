import { Expense, Income } from "./types";

let expenses: Expense[] = [
  { id: "e1", description: "Rent", amount: 1500, category: "housing", date: "2024-01-01" },
  { id: "e2", description: "Groceries", amount: 200, category: "food", date: "2024-01-05" },
  { id: "e3", description: "Gas", amount: 80, category: "transport", date: "2024-01-10" },
];

let incomes: Income[] = [
  { id: "i1", source: "Salary", amount: 4000, date: "2024-01-01" },
  { id: "i2", source: "Freelance", amount: 500, date: "2024-01-15" },
];

export function getExpenses(): Expense[] {
  return expenses;
}

export function getIncomes(): Income[] {
  return incomes;
}

export function addExpense(expense: Expense): void {
  expenses.push(expense);
}

export function deleteExpense(id: string): void {
  expenses = expenses.filter((e) => e.id !== id);
}

export function addIncome(income: Income): void {
  incomes.push(income);
}

export function deleteIncome(id: string): void {
  incomes = incomes.filter((i) => i.id !== id);
}

export function __reset(): void {
  expenses = [
    { id: "e1", description: "Rent", amount: 1500, category: "housing", date: "2024-01-01" },
    { id: "e2", description: "Groceries", amount: 200, category: "food", date: "2024-01-05" },
    { id: "e3", description: "Gas", amount: 80, category: "transport", date: "2024-01-10" },
  ];
  incomes = [
    { id: "i1", source: "Salary", amount: 4000, date: "2024-01-01" },
    { id: "i2", source: "Freelance", amount: 500, date: "2024-01-15" },
  ];
}
