export interface Plant {
  id: string;
  name: string;
  type: 'vegetable' | 'herb' | 'flower' | 'fruit';
  sunlight: 'full' | 'partial' | 'shade';
  wateringFrequency: 'daily' | 'weekly' | 'biweekly';
}

export interface Bed {
  id: string;
  name: string;
  sizesqft: number;
  plantIds: string[];
}

export interface LogEntry {
  id: string;
  bedId: string;
  action: string;
  date: string;
  notes: string;
}

export type Route = 'home' | 'plants' | 'beds' | 'log';
