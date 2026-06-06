import type { Exchange } from "./types";

const seed: Exchange[] = [
  { id: "1", date: "2024-03-15", fromCurrency: "USD", toCurrency: "JPY", amountFrom: 500, amountTo: 73500, location: "Tokyo Airport", fee: 5 },
  { id: "2", date: "2024-03-18", fromCurrency: "USD", toCurrency: "JPY", amountFrom: 200, amountTo: 29000, location: "Kyoto Bank", fee: 2 },
  { id: "3", date: "2024-05-02", fromCurrency: "USD", toCurrency: "EUR", amountFrom: 300, amountTo: 276, location: "Rome Exchange", fee: 3 },
];

let exchanges: Exchange[] = seed.map((e) => ({ ...e }));
let nextId = 4;

export function getExchanges(): Exchange[] {
  return exchanges;
}

export function addExchange(data: Omit<Exchange, "id">): Exchange {
  const ex: Exchange = { ...data, id: String(nextId++) };
  exchanges.push(ex);
  return ex;
}

export function __reset(): void {
  exchanges = seed.map((e) => ({ ...e }));
  nextId = 4;
}
