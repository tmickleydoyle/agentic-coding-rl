export interface Holding {
  id: string; symbol: string; name: string; quantity: number; purchasePrice: number; currentPrice: number
}
export interface Transaction {
  id: string; symbol: string; type: 'buy' | 'sell'; quantity: number; price: number; date: string
}
export type Route = 'home' | 'holdings' | 'transactions' | 'performance'
export interface AppState { route: Route; setRoute: (r: Route) => void }
