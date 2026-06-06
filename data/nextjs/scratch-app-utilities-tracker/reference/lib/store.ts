import { Utility, Bill, Reading } from "./types";

let utilities: Utility[] = [
  { id: "u1", name: "City Electric", type: "electricity", provider: "City Power Co", accountNumber: "CE-001" },
  { id: "u2", name: "City Water", type: "water", provider: "Municipal Water", accountNumber: "CW-001" },
];

let bills: Bill[] = [
  { id: "b1", utilityId: "u1", month: "2024-06", amount: 85.50, dueDate: "2024-06-20", paid: true },
  { id: "b2", utilityId: "u2", month: "2024-06", amount: 42.00, dueDate: "2024-06-25", paid: false },
];

let readings: Reading[] = [
  { id: "rd1", utilityId: "u1", month: "2024-06", units: 450, reading: 15200 },
];

let nextUtilityId = 3;
let nextBillId = 3;
let nextReadingId = 2;

export function __reset() {
  utilities = [
    { id: "u1", name: "City Electric", type: "electricity", provider: "City Power Co", accountNumber: "CE-001" },
    { id: "u2", name: "City Water", type: "water", provider: "Municipal Water", accountNumber: "CW-001" },
  ];
  bills = [
    { id: "b1", utilityId: "u1", month: "2024-06", amount: 85.50, dueDate: "2024-06-20", paid: true },
    { id: "b2", utilityId: "u2", month: "2024-06", amount: 42.00, dueDate: "2024-06-25", paid: false },
  ];
  readings = [
    { id: "rd1", utilityId: "u1", month: "2024-06", units: 450, reading: 15200 },
  ];
  nextUtilityId = 3;
  nextBillId = 3;
  nextReadingId = 2;
}

export function getUtilities(): Utility[] { return utilities; }
export function addUtility(data: Omit<Utility, "id">): Utility {
  const u: Utility = { id: `u${nextUtilityId++}`, ...data };
  utilities.push(u);
  return u;
}
export function removeUtility(id: string): boolean {
  const idx = utilities.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  utilities.splice(idx, 1);
  return true;
}

export function getBills(): Bill[] { return bills; }
export function addBill(data: Omit<Bill, "id">): Bill {
  const b: Bill = { id: `b${nextBillId++}`, ...data };
  bills.push(b);
  return b;
}
export function markBillPaid(id: string): Bill | null {
  const b = bills.find((b) => b.id === id);
  if (!b) return null;
  b.paid = true;
  return b;
}

export function getReadings(): Reading[] { return readings; }
export function addReading(data: Omit<Reading, "id">): Reading {
  const r: Reading = { id: `rd${nextReadingId++}`, ...data };
  readings.push(r);
  return r;
}
