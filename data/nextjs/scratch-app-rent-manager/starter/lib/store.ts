import { Tenant, Payment } from "./types";

export function __reset(): void {}

export function getTenants(): Tenant[] {
  return [];
}

export function addTenant(_data: Omit<Tenant, "id">): Tenant {
  return {} as Tenant;
}

export function removeTenant(_id: string): boolean {
  return false;
}

export function getPayments(): Payment[] {
  return [];
}

export function addPayment(_data: Omit<Payment, "id">): Payment {
  return {} as Payment;
}

export function updatePaymentStatus(_id: string, _status: Payment["status"]): Payment | null {
  return null;
}
