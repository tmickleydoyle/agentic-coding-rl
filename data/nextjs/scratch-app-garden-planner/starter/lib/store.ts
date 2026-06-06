import type { Plant, Bed, LogEntry } from './types';
let plants: Plant[] = []; let beds: Bed[] = []; let log: LogEntry[] = [];
export function __reset() { plants = []; beds = []; log = []; }
export function getPlants() { return plants; }
export function addPlant(_d: Omit<Plant,'id'>): Plant { return {} as Plant; }
export function deletePlant(_id: string) {}
export function getBeds() { return beds; }
export function addBed(_d: Omit<Bed,'id'>): Bed { return {} as Bed; }
export function assignPlantToBed(_bedId: string, _plantId: string) {}
export function removePlantFromBed(_bedId: string, _plantId: string) {}
export function deleteBed(_id: string) {}
export function getLog() { return log; }
export function addLogEntry(_d: Omit<LogEntry,'id'>): LogEntry { return {} as LogEntry; }
export function deleteLogEntry(_id: string) {}
