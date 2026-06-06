import type { Visa } from "./types";

const seed: Visa[] = [
  { id: "1", country: "Japan", visaType: "Tourist", appliedDate: "2024-01-10", expiryDate: "2024-06-10", status: "approved", passportNumber: "A1234567", notes: "3-month stay" },
  { id: "2", country: "USA", visaType: "Business", appliedDate: "2024-02-01", expiryDate: "2024-12-31", status: "approved", passportNumber: "A1234567", notes: "B1 visa" },
  { id: "3", country: "China", visaType: "Tourist", appliedDate: "2024-03-15", expiryDate: "2024-04-15", status: "expired", passportNumber: "A1234567", notes: "Expired" },
  { id: "4", country: "India", visaType: "eVisa", appliedDate: "2024-05-20", expiryDate: "2024-07-20", status: "applied", passportNumber: "A1234567", notes: "Pending" },
];

let visas: Visa[] = seed.map((v) => ({ ...v }));
let nextId = 5;

export function getVisas(): Visa[] {
  return visas;
}

export function addVisa(data: Omit<Visa, "id">): Visa {
  const visa: Visa = { ...data, id: String(nextId++) };
  visas.push(visa);
  return visa;
}

export function __reset(): void {
  visas = seed.map((v) => ({ ...v }));
  nextId = 5;
}
