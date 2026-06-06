import type { Client, Project, Invoice } from './types';

let clients: Client[] = [];
let projects: Project[] = [];
let invoices: Invoice[] = [];

export function __reset() {
  clients = [];
  projects = [];
  invoices = [];
}

export function getClients() { return clients; }
export function addClient(_data: Omit<Client, 'id'>): Client { return {} as Client; }
export function deleteClient(_id: string) {}

export function getProjects() { return projects; }
export function addProject(_data: Omit<Project, 'id'>): Project { return {} as Project; }
export function updateProjectStatus(_id: string, _status: 'active' | 'completed') {}
export function deleteProject(_id: string) {}

export function getInvoices() { return invoices; }
export function addInvoice(_data: Omit<Invoice, 'id' | 'status'>): Invoice { return {} as Invoice; }
export function payInvoice(_id: string) {}
export function deleteInvoice(_id: string) {}
