import { WeatherEntry } from './types';

export function getEntries(): WeatherEntry[] { return []; }
export function addEntry(_date: string, _temperature: number, _condition: WeatherEntry['condition'], _humidity: number, _notes: string): WeatherEntry { throw new Error('Not implemented'); }
export function deleteEntry(_id: string): void {}
export function __reset(): void {}
