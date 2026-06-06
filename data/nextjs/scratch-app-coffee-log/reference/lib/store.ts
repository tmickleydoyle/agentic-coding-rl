import type { Bean, Brew } from './types';

let beans: Bean[] = [
  { id: 'b1', name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', roast: 'light', price: 3.5 },
  { id: 'b2', name: 'Colombian Supremo', origin: 'Colombia', roast: 'medium', price: 2.8 },
];
let brews: Brew[] = [
  { id: 'br1', beanId: 'b1', method: 'pour-over', date: '2025-10-01', rating: 5, notes: 'Floral and bright' },
  { id: 'br2', beanId: 'b2', method: 'espresso', date: '2025-10-03', rating: 4, notes: 'Rich and bold' },
  { id: 'br3', beanId: 'b1', method: 'pour-over', date: '2025-10-05', rating: 4, notes: 'Slightly under-extracted' },
];
let nextId = 100;

export function __reset() {
  beans = [
    { id: 'b1', name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', roast: 'light', price: 3.5 },
    { id: 'b2', name: 'Colombian Supremo', origin: 'Colombia', roast: 'medium', price: 2.8 },
  ];
  brews = [
    { id: 'br1', beanId: 'b1', method: 'pour-over', date: '2025-10-01', rating: 5, notes: 'Floral and bright' },
    { id: 'br2', beanId: 'b2', method: 'espresso', date: '2025-10-03', rating: 4, notes: 'Rich and bold' },
    { id: 'br3', beanId: 'b1', method: 'pour-over', date: '2025-10-05', rating: 4, notes: 'Slightly under-extracted' },
  ];
  nextId = 100;
}

export function getBeans() { return beans; }
export function addBean(data: Omit<Bean, 'id'>): Bean {
  const b: Bean = { id: `b${nextId++}`, ...data };
  beans = [...beans, b];
  return b;
}
export function deleteBean(id: string) {
  brews = brews.filter(br => br.beanId !== id);
  beans = beans.filter(b => b.id !== id);
}

export function getBrews() { return brews; }
export function addBrew(data: Omit<Brew, 'id'>): Brew {
  const br: Brew = { id: `br${nextId++}`, ...data };
  brews = [...brews, br];
  return br;
}
export function deleteBrew(id: string) { brews = brews.filter(br => br.id !== id); }
