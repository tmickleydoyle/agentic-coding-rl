import { Tenant, Payment } from "./types";

let tenants: Tenant[] = [
  {
    id: "t1",
    name: "Alice Johnson",
    unit: "101",
    monthlyRent: 1200,
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    status: "active",
  },
  {
    id: "t2",
    name: "Bob Smith",
    unit: "102",
    monthlyRent: 1400,
    leaseStart: "2024-03-01",
    leaseEnd: "2025-02-28",
    status: "active",
  },
];

let payments: Payment[] = [
  {
    id: "p1",
    tenantId: "t1",
    amount: 1200,
    date: "2024-06-01",
    month: "2024-06",
    status: "paid",
  },
  {
    id: "p2",
    tenantId: "t2",
    amount: 1400,
    date: "2024-06-03",
    month: "2024-06",
    status: "paid",
  },
];

let nextTenantId = 3;
let nextPaymentId = 3;

export function __reset() {
  tenants = [
    {
      id: "t1",
      name: "Alice Johnson",
      unit: "101",
      monthlyRent: 1200,
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      status: "active",
    },
    {
      id: "t2",
      name: "Bob Smith",
      unit: "102",
      monthlyRent: 1400,
      leaseStart: "2024-03-01",
      leaseEnd: "2025-02-28",
      status: "active",
    },
  ];
  payments = [
    {
      id: "p1",
      tenantId: "t1",
      amount: 1200,
      date: "2024-06-01",
      month: "2024-06",
      status: "paid",
    },
    {
      id: "p2",
      tenantId: "t2",
      amount: 1400,
      date: "2024-06-03",
      month: "2024-06",
      status: "paid",
    },
  ];
  nextTenantId = 3;
  nextPaymentId = 3;
}

export function getTenants(): Tenant[] {
  return tenants;
}

export function addTenant(data: Omit<Tenant, "id">): Tenant {
  const tenant: Tenant = { id: `t${nextTenantId++}`, ...data };
  tenants.push(tenant);
  return tenant;
}

export function removeTenant(id: string): boolean {
  const idx = tenants.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tenants.splice(idx, 1);
  return true;
}

export function getPayments(): Payment[] {
  return payments;
}

export function addPayment(data: Omit<Payment, "id">): Payment {
  const payment: Payment = { id: `p${nextPaymentId++}`, ...data };
  payments.push(payment);
  return payment;
}

export function updatePaymentStatus(id: string, status: Payment["status"]): Payment | null {
  const p = payments.find((p) => p.id === id);
  if (!p) return null;
  p.status = status;
  return p;
}
