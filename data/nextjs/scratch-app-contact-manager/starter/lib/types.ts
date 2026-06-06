export interface Contact { id: string; name: string; email: string; phone: string; group: string; }
export interface Group { id: string; name: string; }
export type Route = 'home' | 'contacts' | 'groups' | 'search';
