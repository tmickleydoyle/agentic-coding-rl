export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  status: 'active' | 'completed';
  hourlyRate: number;
  hoursLogged: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  status: 'unpaid' | 'paid';
  dueDate: string;
}

export type Route = 'home' | 'clients' | 'projects' | 'invoices';

export interface AppState {
  route: Route;
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
}
