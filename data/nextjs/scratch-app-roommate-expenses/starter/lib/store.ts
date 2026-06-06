import { Roommate, Expense, Settlement } from "./types";

export function __reset(): void {}
export function getRoommates(): Roommate[] { return []; }
export function addRoommate(_data: Omit<Roommate, "id">): Roommate { return {} as Roommate; }
export function removeRoommate(_id: string): boolean { return false; }
export function getExpenses(): Expense[] { return []; }
export function addExpense(_data: Omit<Expense, "id">): Expense { return {} as Expense; }
export function getSettlements(): Settlement[] { return []; }
export function addSettlement(_data: Omit<Settlement, "id">): Settlement { return {} as Settlement; }
