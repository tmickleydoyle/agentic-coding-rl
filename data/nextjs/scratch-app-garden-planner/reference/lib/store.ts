import type { Plant, Bed, LogEntry } from './types';

let plants: Plant[] = [
  { id: 'pl1', name: 'Tomato', type: 'vegetable', sunlight: 'full', wateringFrequency: 'daily' },
  { id: 'pl2', name: 'Basil', type: 'herb', sunlight: 'full', wateringFrequency: 'weekly' },
  { id: 'pl3', name: 'Lavender', type: 'flower', sunlight: 'full', wateringFrequency: 'biweekly' },
];
let beds: Bed[] = [
  { id: 'b1', name: 'Raised Bed A', sizesqft: 16, plantIds: ['pl1', 'pl2'] },
  { id: 'b2', name: 'Border B', sizesqft: 8, plantIds: [] },
];
let log: LogEntry[] = [
  { id: 'lg1', bedId: 'b1', action: 'Watered', date: '2025-10-05', notes: 'Soaked thoroughly' },
];
let nextId = 100;

export function __reset() {
  plants = [
    { id: 'pl1', name: 'Tomato', type: 'vegetable', sunlight: 'full', wateringFrequency: 'daily' },
    { id: 'pl2', name: 'Basil', type: 'herb', sunlight: 'full', wateringFrequency: 'weekly' },
    { id: 'pl3', name: 'Lavender', type: 'flower', sunlight: 'full', wateringFrequency: 'biweekly' },
  ];
  beds = [
    { id: 'b1', name: 'Raised Bed A', sizesqft: 16, plantIds: ['pl1', 'pl2'] },
    { id: 'b2', name: 'Border B', sizesqft: 8, plantIds: [] },
  ];
  log = [{ id: 'lg1', bedId: 'b1', action: 'Watered', date: '2025-10-05', notes: 'Soaked thoroughly' }];
  nextId = 100;
}

export function getPlants() { return plants; }
export function addPlant(data: Omit<Plant, 'id'>): Plant {
  const p: Plant = { id: `pl${nextId++}`, ...data };
  plants = [...plants, p];
  return p;
}
export function deletePlant(id: string) {
  beds = beds.map(b => ({ ...b, plantIds: b.plantIds.filter(pid => pid !== id) }));
  plants = plants.filter(p => p.id !== id);
}

export function getBeds() { return beds; }
export function addBed(data: Omit<Bed, 'id'>): Bed {
  const b: Bed = { id: `b${nextId++}`, ...data };
  beds = [...beds, b];
  return b;
}
export function assignPlantToBed(bedId: string, plantId: string) {
  beds = beds.map(b => b.id === bedId && !b.plantIds.includes(plantId) ? { ...b, plantIds: [...b.plantIds, plantId] } : b);
}
export function removePlantFromBed(bedId: string, plantId: string) {
  beds = beds.map(b => b.id === bedId ? { ...b, plantIds: b.plantIds.filter(pid => pid !== plantId) } : b);
}
export function deleteBed(id: string) {
  log = log.filter(e => e.bedId !== id);
  beds = beds.filter(b => b.id !== id);
}

export function getLog() { return log; }
export function addLogEntry(data: Omit<LogEntry, 'id'>): LogEntry {
  const e: LogEntry = { id: `lg${nextId++}`, ...data };
  log = [...log, e];
  return e;
}
export function deleteLogEntry(id: string) { log = log.filter(e => e.id !== id); }
