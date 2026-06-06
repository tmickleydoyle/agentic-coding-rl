import { Debt, Payment } from "./types";
export function getDebts(): Debt[] { return []; }
export function getPayments(): Payment[] { return []; }
export function addDebt(_d: Debt): void {}
export function deleteDebt(_id: string): void {}
export function addPayment(_p: Payment): void {}
export function __reset(): void {}
