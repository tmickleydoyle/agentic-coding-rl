export interface Subscription {
  id: string;
  name: string;
  monthlyCost: number;
  billingDay: number;
  category: string;
  status: 'active' | 'paused';
}

export type Route = 'home' | 'subscriptions' | 'calendar' | 'stats';
