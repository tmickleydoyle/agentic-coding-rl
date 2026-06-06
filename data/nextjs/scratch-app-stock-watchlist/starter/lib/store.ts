import { Stock, Alert, HistoryEntry } from './types';

export function getStocks(): Stock[] { return []; }
export function addStock(_ticker: string, _name: string, _price: number, _quantity: number, _currency: string): Stock { throw new Error('Not implemented'); }
export function updateStockPrice(_id: string, _price: number): void {}
export function deleteStock(_id: string): void {}
export function getAlerts(): Alert[] { return []; }
export function addAlert(_stockId: string, _targetPrice: number, _condition: 'above' | 'below'): Alert { throw new Error('Not implemented'); }
export function deleteAlert(_id: string): void {}
export function getHistory(): HistoryEntry[] { return []; }
export function __reset(): void {}
