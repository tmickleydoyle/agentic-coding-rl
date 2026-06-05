export type ClientStatus = 'active' | 'lead' | 'churned'
export type Route = 'clients' | 'summary' | 'settings'
export type Client = { id: number; name: string; status: ClientStatus; lifetimeValue: number }
