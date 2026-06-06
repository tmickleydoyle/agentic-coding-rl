import { Bill } from "./types";

let bills: Bill[] = [
  { id: "b1", name: "Rent", amount: 1500, dueDay: 1, category: "housing", isActive: true },
  { id: "b2", name: "Electric", amount: 120, dueDay: 15, category: "utilities", isActive: true },
  { id: "b3", name: "Internet", amount: 60, dueDay: 20, category: "utilities", isActive: true },
  { id: "b4", name: "Gym", amount: 45, dueDay: 5, category: "health", isActive: false },
];

export function getBills(): Bill[] { return bills; }
export function addBill(b: Bill): void { bills.push(b); }
export function deleteBill(id: string): void { bills = bills.filter((b) => b.id !== id); }
export function toggleBill(id: string): void {
  bills = bills.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b);
}

export function __reset(): void {
  bills = [
    { id: "b1", name: "Rent", amount: 1500, dueDay: 1, category: "housing", isActive: true },
    { id: "b2", name: "Electric", amount: 120, dueDay: 15, category: "utilities", isActive: true },
    { id: "b3", name: "Internet", amount: 60, dueDay: 20, category: "utilities", isActive: true },
    { id: "b4", name: "Gym", amount: 45, dueDay: 5, category: "health", isActive: false },
  ];
}
