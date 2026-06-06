import type { Pet, Visit, Medication } from './types';

let pets: Pet[] = [
  { id: 'pt1', name: 'Buddy', species: 'dog', birthDate: '2019-05-01', weight: 12 },
  { id: 'pt2', name: 'Whiskers', species: 'cat', birthDate: '2021-03-15', weight: 4 },
];
let visits: Visit[] = [
  { id: 'v1', petId: 'pt1', vetName: 'Dr. Smith', date: '2025-11-10', reason: 'Checkup', notes: 'Healthy' },
];
let medications: Medication[] = [
  { id: 'm1', petId: 'pt1', name: 'Heartgard', dosage: '1 tablet', frequency: 'monthly', active: true },
  { id: 'm2', petId: 'pt2', name: 'Flea Treatment', dosage: '0.5ml', frequency: 'monthly', active: false },
];
let nextId = 100;

export function __reset() {
  pets = [
    { id: 'pt1', name: 'Buddy', species: 'dog', birthDate: '2019-05-01', weight: 12 },
    { id: 'pt2', name: 'Whiskers', species: 'cat', birthDate: '2021-03-15', weight: 4 },
  ];
  visits = [{ id: 'v1', petId: 'pt1', vetName: 'Dr. Smith', date: '2025-11-10', reason: 'Checkup', notes: 'Healthy' }];
  medications = [
    { id: 'm1', petId: 'pt1', name: 'Heartgard', dosage: '1 tablet', frequency: 'monthly', active: true },
    { id: 'm2', petId: 'pt2', name: 'Flea Treatment', dosage: '0.5ml', frequency: 'monthly', active: false },
  ];
  nextId = 100;
}

export function getPets() { return pets; }
export function addPet(data: Omit<Pet, 'id'>): Pet {
  const p: Pet = { id: `pt${nextId++}`, ...data };
  pets = [...pets, p];
  return p;
}
export function deletePet(id: string) {
  visits = visits.filter(v => v.petId !== id);
  medications = medications.filter(m => m.petId !== id);
  pets = pets.filter(p => p.id !== id);
}

export function getVisits() { return visits; }
export function addVisit(data: Omit<Visit, 'id'>): Visit {
  const v: Visit = { id: `v${nextId++}`, ...data };
  visits = [...visits, v];
  return v;
}
export function deleteVisit(id: string) { visits = visits.filter(v => v.id !== id); }

export function getMedications() { return medications; }
export function addMedication(data: Omit<Medication, 'id'>): Medication {
  const m: Medication = { id: `m${nextId++}`, ...data };
  medications = [...medications, m];
  return m;
}
export function toggleMedication(id: string) {
  medications = medications.map(m => m.id === id ? { ...m, active: !m.active } : m);
}
export function deleteMedication(id: string) { medications = medications.filter(m => m.id !== id); }
