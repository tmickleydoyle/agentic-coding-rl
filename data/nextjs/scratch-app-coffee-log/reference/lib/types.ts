export interface Bean {
  id: string;
  name: string;
  origin: string;
  roast: 'light' | 'medium' | 'dark';
  price: number;
}

export interface Brew {
  id: string;
  beanId: string;
  method: 'espresso' | 'pour-over' | 'french-press' | 'aeropress' | 'cold-brew';
  date: string;
  rating: number;
  notes: string;
}

export type Route = 'home' | 'log' | 'beans' | 'stats';
