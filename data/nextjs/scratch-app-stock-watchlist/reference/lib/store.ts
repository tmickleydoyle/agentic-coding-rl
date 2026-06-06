import { Stock, Alert, HistoryEntry } from './types';

let stocks: Stock[] = [
  { id: 'stk1', ticker: 'AAPL', name: 'Apple Inc.', price: 185.50, quantity: 10, currency: 'USD' },
  { id: 'stk2', ticker: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, quantity: 5, currency: 'USD' },
];
let alerts: Alert[] = [
  { id: 'al1', stockId: 'stk1', targetPrice: 200, condition: 'above', triggered: false },
];
let history: HistoryEntry[] = [];
let nextStockId = 3;
let nextAlertId = 2;
let nextHistoryId = 1;

export function getStocks(): Stock[] { return stocks; }

export function addStock(ticker: string, name: string, price: number, quantity: number, currency: string): Stock {
  const t = ticker.toUpperCase().trim();
  if (!t) throw new Error('Ticker required');
  if (price <= 0 || quantity <= 0) throw new Error('Price and quantity must be positive');
  if (stocks.find(s => s.ticker === t)) throw new Error('Ticker already in watchlist');
  const stock: Stock = { id: `stk${nextStockId++}`, ticker: t, name, price, quantity, currency };
  stocks.push(stock);
  return stock;
}

export function updateStockPrice(id: string, price: number): void {
  stocks = stocks.map(s => s.id === id ? { ...s, price } : s);
  history.push({ id: `h${nextHistoryId++}`, stockId: id, price, timestamp: new Date().toISOString() });
  alerts = alerts.map(a => {
    if (a.stockId !== id) return a;
    const triggered = a.condition === 'above' ? price >= a.targetPrice : price <= a.targetPrice;
    return triggered ? { ...a, triggered: true } : a;
  });
}

export function deleteStock(id: string): void {
  stocks = stocks.filter(s => s.id !== id);
  alerts = alerts.filter(a => a.stockId !== id);
  history = history.filter(h => h.stockId !== id);
}

export function getAlerts(): Alert[] { return alerts; }
export function addAlert(stockId: string, targetPrice: number, condition: 'above' | 'below'): Alert {
  const alert: Alert = { id: `al${nextAlertId++}`, stockId, targetPrice, condition, triggered: false };
  alerts.push(alert);
  return alert;
}
export function deleteAlert(id: string): void { alerts = alerts.filter(a => a.id !== id); }

export function getHistory(): HistoryEntry[] { return history; }

export function __reset(): void {
  stocks = [
    { id: 'stk1', ticker: 'AAPL', name: 'Apple Inc.', price: 185.50, quantity: 10, currency: 'USD' },
    { id: 'stk2', ticker: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, quantity: 5, currency: 'USD' },
  ];
  alerts = [{ id: 'al1', stockId: 'stk1', targetPrice: 200, condition: 'above', triggered: false }];
  history = [];
  nextStockId = 3;
  nextAlertId = 2;
  nextHistoryId = 1;
}
