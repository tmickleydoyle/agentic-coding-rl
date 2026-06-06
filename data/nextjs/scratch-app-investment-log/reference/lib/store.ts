import { Holding, Transaction } from "./types";

let holdings: Holding[] = [
  { id: "h1", ticker: "AAPL", shares: 10, avgPrice: 150, currentPrice: 180 },
  { id: "h2", ticker: "MSFT", shares: 5, avgPrice: 280, currentPrice: 310 },
  { id: "h3", ticker: "GOOGL", shares: 2, avgPrice: 2800, currentPrice: 2650 },
];

let transactions: Transaction[] = [
  { id: "t1", ticker: "AAPL", type: "buy", shares: 10, price: 150, date: "2023-06-01" },
  { id: "t2", ticker: "MSFT", type: "buy", shares: 5, price: 280, date: "2023-07-15" },
  { id: "t3", ticker: "GOOGL", type: "buy", shares: 2, price: 2800, date: "2023-08-01" },
];

export function getHoldings(): Holding[] { return holdings; }
export function getTransactions(): Transaction[] { return transactions; }
export function addHolding(h: Holding): void { holdings.push(h); }
export function deleteHolding(id: string): void { holdings = holdings.filter((h) => h.id !== id); }
export function addTransaction(t: Transaction): void { transactions.push(t); }

export function __reset(): void {
  holdings = [
    { id: "h1", ticker: "AAPL", shares: 10, avgPrice: 150, currentPrice: 180 },
    { id: "h2", ticker: "MSFT", shares: 5, avgPrice: 280, currentPrice: 310 },
    { id: "h3", ticker: "GOOGL", shares: 2, avgPrice: 2800, currentPrice: 2650 },
  ];
  transactions = [
    { id: "t1", ticker: "AAPL", type: "buy", shares: 10, price: 150, date: "2023-06-01" },
    { id: "t2", ticker: "MSFT", type: "buy", shares: 5, price: 280, date: "2023-07-15" },
    { id: "t3", ticker: "GOOGL", type: "buy", shares: 2, price: 2800, date: "2023-08-01" },
  ];
}
