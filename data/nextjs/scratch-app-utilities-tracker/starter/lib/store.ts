import { Utility, Bill, Reading } from "./types";

export function __reset(): void {}
export function getUtilities(): Utility[] { return []; }
export function addUtility(_data: Omit<Utility, "id">): Utility { return {} as Utility; }
export function removeUtility(_id: string): boolean { return false; }
export function getBills(): Bill[] { return []; }
export function addBill(_data: Omit<Bill, "id">): Bill { return {} as Bill; }
export function markBillPaid(_id: string): Bill | null { return null; }
export function getReadings(): Reading[] { return []; }
export function addReading(_data: Omit<Reading, "id">): Reading { return {} as Reading; }
