import { Roommate, Expense, Settlement } from "./types";

let roommates: Roommate[] = [
  { id: "r1", name: "Alex", email: "alex@example.com" },
  { id: "r2", name: "Jamie", email: "jamie@example.com" },
  { id: "r3", name: "Sam", email: "sam@example.com" },
];

let expenses: Expense[] = [
  { id: "e1", description: "Groceries", amount: 90, payerId: "r1", splitWith: ["r1", "r2", "r3"], date: "2024-06-01", category: "food" },
  { id: "e2", description: "Internet", amount: 60, payerId: "r2", splitWith: ["r1", "r2", "r3"], date: "2024-06-02", category: "utilities" },
];

let settlements: Settlement[] = [];

let nextRoommateId = 4;
let nextExpenseId = 3;
let nextSettlementId = 1;

export function __reset() {
  roommates = [
    { id: "r1", name: "Alex", email: "alex@example.com" },
    { id: "r2", name: "Jamie", email: "jamie@example.com" },
    { id: "r3", name: "Sam", email: "sam@example.com" },
  ];
  expenses = [
    { id: "e1", description: "Groceries", amount: 90, payerId: "r1", splitWith: ["r1", "r2", "r3"], date: "2024-06-01", category: "food" },
    { id: "e2", description: "Internet", amount: 60, payerId: "r2", splitWith: ["r1", "r2", "r3"], date: "2024-06-02", category: "utilities" },
  ];
  settlements = [];
  nextRoommateId = 4;
  nextExpenseId = 3;
  nextSettlementId = 1;
}

export function getRoommates(): Roommate[] {
  return roommates;
}

export function addRoommate(data: Omit<Roommate, "id">): Roommate {
  const r: Roommate = { id: `r${nextRoommateId++}`, ...data };
  roommates.push(r);
  return r;
}

export function removeRoommate(id: string): boolean {
  const idx = roommates.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  roommates.splice(idx, 1);
  return true;
}

export function getExpenses(): Expense[] {
  return expenses;
}

export function addExpense(data: Omit<Expense, "id">): Expense {
  const e: Expense = { id: `e${nextExpenseId++}`, ...data };
  expenses.push(e);
  return e;
}

export function getSettlements(): Settlement[] {
  return settlements;
}

export function addSettlement(data: Omit<Settlement, "id">): Settlement {
  const s: Settlement = { id: `s${nextSettlementId++}`, ...data };
  settlements.push(s);
  return s;
}
