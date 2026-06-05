export type ClientStatus = 'active' | 'lead' | 'churned'
export type Route = 'roster' | 'summary' | 'settings'
export type Client = { id: number; name: string; status: ClientStatus; value: number }
