import type { Visa } from "./types";

export function getVisas(): Visa[] {
  return [];
}

export function addVisa(_data: Omit<Visa, "id">): Visa {
  return { id: "", country: "", visaType: "", appliedDate: "", expiryDate: "", status: "applied", passportNumber: "", notes: "" };
}

export function __reset(): void {}
