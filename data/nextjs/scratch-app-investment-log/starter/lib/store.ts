import { Holding, Transaction } from "./types";
export function getHoldings(): Holding[] { return []; }
export function getTransactions(): Transaction[] { return []; }
export function addHolding(_h: Holding): void {}
export function deleteHolding(_id: string): void {}
export function addTransaction(_t: Transaction): void {}
export function __reset(): void {}
