import type { Pet, Visit, Medication } from './types';
let pets: Pet[] = []; let visits: Visit[] = []; let medications: Medication[] = [];
export function __reset() { pets = []; visits = []; medications = []; }
export function getPets() { return pets; }
export function addPet(_d: Omit<Pet,'id'>): Pet { return {} as Pet; }
export function deletePet(_id: string) {}
export function getVisits() { return visits; }
export function addVisit(_d: Omit<Visit,'id'>): Visit { return {} as Visit; }
export function deleteVisit(_id: string) {}
export function getMedications() { return medications; }
export function addMedication(_d: Omit<Medication,'id'>): Medication { return {} as Medication; }
export function toggleMedication(_id: string) {}
export function deleteMedication(_id: string) {}
