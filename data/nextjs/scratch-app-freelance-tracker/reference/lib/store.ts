import type { Client, Project, Invoice } from './types';

let clients: Client[] = [
  { id: 'c1', name: 'Alice Corp', email: 'alice@example.com', company: 'Alice Corp' },
  { id: 'c2', name: 'Bob LLC', email: 'bob@example.com', company: 'Bob LLC' },
];

let projects: Project[] = [
  { id: 'p1', clientId: 'c1', title: 'Website Redesign', status: 'active', hourlyRate: 100, hoursLogged: 10 },
  { id: 'p2', clientId: 'c2', title: 'Logo Design', status: 'completed', hourlyRate: 80, hoursLogged: 5 },
];

let invoices: Invoice[] = [
  { id: 'i1', projectId: 'p1', amount: 1000, status: 'unpaid', dueDate: '2025-12-01' },
  { id: 'i2', projectId: 'p2', amount: 400, status: 'paid', dueDate: '2025-11-01' },
];

let nextId = 100;
function genId(prefix: string) {
  return `${prefix}${nextId++}`;
}

export function __reset() {
  clients = [
    { id: 'c1', name: 'Alice Corp', email: 'alice@example.com', company: 'Alice Corp' },
    { id: 'c2', name: 'Bob LLC', email: 'bob@example.com', company: 'Bob LLC' },
  ];
  projects = [
    { id: 'p1', clientId: 'c1', title: 'Website Redesign', status: 'active', hourlyRate: 100, hoursLogged: 10 },
    { id: 'p2', clientId: 'c2', title: 'Logo Design', status: 'completed', hourlyRate: 80, hoursLogged: 5 },
  ];
  invoices = [
    { id: 'i1', projectId: 'p1', amount: 1000, status: 'unpaid', dueDate: '2025-12-01' },
    { id: 'i2', projectId: 'p2', amount: 400, status: 'paid', dueDate: '2025-11-01' },
  ];
  nextId = 100;
}

export function getClients() { return clients; }
export function addClient(data: Omit<Client, 'id'>): Client {
  const c: Client = { id: genId('c'), ...data };
  clients = [...clients, c];
  return c;
}
export function deleteClient(id: string) {
  const projectIds = projects.filter(p => p.clientId === id).map(p => p.id);
  invoices = invoices.filter(i => !projectIds.includes(i.projectId));
  projects = projects.filter(p => p.clientId !== id);
  clients = clients.filter(c => c.id !== id);
}

export function getProjects() { return projects; }
export function addProject(data: Omit<Project, 'id'>): Project {
  const p: Project = { id: genId('p'), ...data };
  projects = [...projects, p];
  return p;
}
export function updateProjectStatus(id: string, status: 'active' | 'completed') {
  projects = projects.map(p => p.id === id ? { ...p, status } : p);
}
export function deleteProject(id: string) {
  invoices = invoices.filter(i => i.projectId !== id);
  projects = projects.filter(p => p.id !== id);
}

export function getInvoices() { return invoices; }
export function addInvoice(data: Omit<Invoice, 'id' | 'status'>): Invoice {
  const inv: Invoice = { id: genId('i'), status: 'unpaid', ...data };
  invoices = [...invoices, inv];
  return inv;
}
export function payInvoice(id: string) {
  invoices = invoices.map(i => i.id === id ? { ...i, status: 'paid' } : i);
}
export function deleteInvoice(id: string) {
  invoices = invoices.filter(i => i.id !== id);
}
