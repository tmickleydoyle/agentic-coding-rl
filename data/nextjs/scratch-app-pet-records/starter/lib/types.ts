export interface Pet { id: string; name: string; species: 'dog'|'cat'|'bird'|'rabbit'|'other'; birthDate: string; weight: number; }
export interface Visit { id: string; petId: string; vetName: string; date: string; reason: string; notes: string; }
export interface Medication { id: string; petId: string; name: string; dosage: string; frequency: 'daily'|'weekly'|'monthly'; active: boolean; }
export type Route = 'home' | 'pets' | 'visits' | 'medications';
