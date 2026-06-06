import { WeatherEntry } from './types';

let entries: WeatherEntry[] = [
  { id: 'w1', date: '2024-01-01', temperature: 22, condition: 'sunny', humidity: 45, notes: 'Clear morning' },
  { id: 'w2', date: '2024-01-02', temperature: 15, condition: 'cloudy', humidity: 70, notes: 'Overcast' },
  { id: 'w3', date: '2024-01-03', temperature: 8, condition: 'rainy', humidity: 90, notes: 'Heavy rain' },
];
let nextId = 4;

export function getEntries(): WeatherEntry[] { return entries; }

export function addEntry(date: string, temperature: number, condition: WeatherEntry['condition'], humidity: number, notes: string): WeatherEntry {
  if (!date) throw new Error('Date required');
  if (humidity < 0 || humidity > 100) throw new Error('Humidity must be 0-100');
  if (entries.find(e => e.date === date)) throw new Error('Entry for this date already exists');
  const entry: WeatherEntry = { id: `w${nextId++}`, date, temperature, condition, humidity, notes };
  entries.push(entry);
  return entry;
}

export function deleteEntry(id: string): void {
  entries = entries.filter(e => e.id !== id);
}

export function __reset(): void {
  entries = [
    { id: 'w1', date: '2024-01-01', temperature: 22, condition: 'sunny', humidity: 45, notes: 'Clear morning' },
    { id: 'w2', date: '2024-01-02', temperature: 15, condition: 'cloudy', humidity: 70, notes: 'Overcast' },
    { id: 'w3', date: '2024-01-03', temperature: 8, condition: 'rainy', humidity: 90, notes: 'Heavy rain' },
  ];
  nextId = 4;
}
