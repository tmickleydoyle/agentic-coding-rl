import { Debt, Payment } from "./types";

let debts: Debt[] = [
  { id: "d1", name: "Credit Card", balance: 3000, interestRate: 22.9, minimumPayment: 60 },
  { id: "d2", name: "Car Loan", balance: 8000, interestRate: 6.5, minimumPayment: 200 },
  { id: "d3", name: "Student Loan", balance: 15000, interestRate: 4.5, minimumPayment: 150 },
];

let payments: Payment[] = [
  { id: "p1", debtId: "d1", amount: 200, date: "2024-01-05" },
  { id: "p2", debtId: "d2", amount: 300, date: "2024-01-10" },
];

export function getDebts(): Debt[] { return debts; }
export function getPayments(): Payment[] { return payments; }
export function addDebt(d: Debt): void { debts.push(d); }
export function deleteDebt(id: string): void {
  debts = debts.filter((d) => d.id !== id);
  payments = payments.filter((p) => p.debtId !== id);
}
export function addPayment(p: Payment): void { payments.push(p); }

export function __reset(): void {
  debts = [
    { id: "d1", name: "Credit Card", balance: 3000, interestRate: 22.9, minimumPayment: 60 },
    { id: "d2", name: "Car Loan", balance: 8000, interestRate: 6.5, minimumPayment: 200 },
    { id: "d3", name: "Student Loan", balance: 15000, interestRate: 4.5, minimumPayment: 150 },
  ];
  payments = [
    { id: "p1", debtId: "d1", amount: 200, date: "2024-01-05" },
    { id: "p2", debtId: "d2", amount: 300, date: "2024-01-10" },
  ];
}
