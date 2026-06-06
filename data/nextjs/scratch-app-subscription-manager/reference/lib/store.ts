import type { Subscription } from './types';

let subs: Subscription[] = [
  { id: 's1', name: 'Netflix', monthlyCost: 15.99, billingDay: 1, category: 'Entertainment', status: 'active' },
  { id: 's2', name: 'Spotify', monthlyCost: 9.99, billingDay: 15, category: 'Entertainment', status: 'active' },
  { id: 's3', name: 'GitHub', monthlyCost: 4, billingDay: 20, category: 'Dev Tools', status: 'paused' },
];

let nextId = 100;

export function __reset() {
  subs = [
    { id: 's1', name: 'Netflix', monthlyCost: 15.99, billingDay: 1, category: 'Entertainment', status: 'active' },
    { id: 's2', name: 'Spotify', monthlyCost: 9.99, billingDay: 15, category: 'Entertainment', status: 'active' },
    { id: 's3', name: 'GitHub', monthlyCost: 4, billingDay: 20, category: 'Dev Tools', status: 'paused' },
  ];
  nextId = 100;
}

export function getSubscriptions() { return subs; }

export function addSubscription(data: Omit<Subscription, 'id'>): Subscription {
  const s: Subscription = { id: `s${nextId++}`, ...data };
  subs = [...subs, s];
  return s;
}

export function toggleStatus(id: string) {
  subs = subs.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s);
}

export function deleteSubscription(id: string) {
  subs = subs.filter(s => s.id !== id);
}
