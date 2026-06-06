import type { Subscription } from './types';

let subs: Subscription[] = [];

export function __reset() { subs = []; }
export function getSubscriptions() { return subs; }
export function addSubscription(_data: Omit<Subscription, 'id'>): Subscription { return {} as Subscription; }
export function toggleStatus(_id: string) {}
export function deleteSubscription(_id: string) {}
