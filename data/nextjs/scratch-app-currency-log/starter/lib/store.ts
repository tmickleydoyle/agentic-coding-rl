import type { Exchange } from "./types";

export function getExchanges(): Exchange[] {
  return [];
}

export function addExchange(_data: Omit<Exchange, "id">): Exchange {
  return { id: "", date: "", fromCurrency: "", toCurrency: "", amountFrom: 0, amountTo: 0, location: "", fee: 0 };
}

export function __reset(): void {}
